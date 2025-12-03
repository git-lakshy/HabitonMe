from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime

class UserBase(BaseModel):
    device_token: str
    notification_time: str
    timezone: str = "UTC"

class UserCreate(UserBase):
    pass

class User(UserBase):
    id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class CompletionBase(BaseModel):
    habit_id: int
    date: str
    status: bool

class CompletionCreate(CompletionBase):
    pass

class Completion(CompletionBase):
    id: int
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)

class HabitBase(BaseModel):
    name: str
    frequency: str = "daily"
    color: str = "#6200ee"
    icon: str = "check"

class HabitCreate(HabitBase):
    pass

class HabitUpdate(HabitBase):
    id: int
    is_deleted: bool = False

class Habit(HabitBase):
    id: int
    user_id: int
    is_deleted: bool
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)

class SyncRequest(BaseModel):
    device_token: str
    habits: List[HabitUpdate]
    completions: List[CompletionCreate]

class SyncResponse(BaseModel):
    habits: List[Habit]
    completions: List[Completion]
