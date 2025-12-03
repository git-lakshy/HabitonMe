from fastapi import FastAPI, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
import asyncio

import models, schemas, database
from database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Habit Tracker API")

@app.get("/")
async def root():
    return {"message": "Welcome to the Habit Tracker API"}

@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.device_token == user.device_token).first()
    if db_user:
        db_user.notification_time = user.notification_time
        db_user.timezone = user.timezone
        db.commit()
        db.refresh(db_user)
        return db_user
    
    new_user = models.User(
        device_token=user.device_token,
        notification_time=user.notification_time,
        timezone=user.timezone
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/sync", response_model=schemas.SyncResponse)
def sync_data(sync_data: schemas.SyncRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.device_token == sync_data.device_token).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Update/Create Habits from Client
    for h in sync_data.habits:
        db_habit = db.query(models.Habit).filter(models.Habit.id == h.id, models.Habit.user_id == user.id).first()
        if db_habit:
            # Simple conflict resolution: replace with client data if provided
            db_habit.name = h.name
            db_habit.frequency = h.frequency
            db_habit.color = h.color
            db_habit.icon = h.icon
            db_habit.is_deleted = h.is_deleted
        else:
            new_habit = models.Habit(
                user_id=user.id,
                name=h.name,
                frequency=h.frequency,
                color=h.color,
                icon=h.icon,
                is_deleted=h.is_deleted
            )
            db.add(new_habit)
    
    db.commit()

    # Create Completions from Client
    for c in sync_data.completions:
        db_completion = db.query(models.Completion).filter(
            models.Completion.habit_id == c.habit_id,
            models.Completion.date == c.date
        ).first()
        if not db_completion:
            new_completion = models.Completion(
                habit_id=c.habit_id,
                date=c.date,
                status=c.status
            )
            db.add(new_completion)
    
    db.commit()

    # Get all habits and completions for this user to send back
    all_habits = db.query(models.Habit).filter(models.Habit.user_id == user.id).all()
    habit_ids = [h.id for h in all_habits]
    all_completions = db.query(models.Completion).filter(models.Completion.habit_id.in_(habit_ids)).all()

    return {
        "habits": all_habits,
        "completions": all_completions
    }

# FCM Placeholder logic
async def send_daily_reminder(device_token: str):
    print(f"Sending reminder to {device_token}")
    # Integration with firebase-admin would go here
    pass

@app.post("/test-notification")
async def test_notification(device_token: str, background_tasks: BackgroundTasks):
    background_tasks.add_task(send_daily_reminder, device_token)
    return {"status": "Notification queued"}
