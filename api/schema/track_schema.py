from typing import List

from pydantic import BaseModel, Field


class Pattern(BaseModel):
    synth: List[List[int]]
    bass: List[List[int]]
    drums: List[List[int]]


class TrackParams(BaseModel):
    name: str = Field(..., min_length=1)
    pattern: Pattern
