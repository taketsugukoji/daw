from typing import List

from pydantic import BaseModel, Field


class ToneInst(BaseModel):
    pattern: List[List[int]]
    waveType: str


class Drums(BaseModel):
    pattern: List[List[int]]


class Instruments(BaseModel):
    synth: ToneInst
    bass: ToneInst
    drums: Drums


class TrackParams(BaseModel):
    name: str = Field(..., min_length=1)
    instruments: Instruments
