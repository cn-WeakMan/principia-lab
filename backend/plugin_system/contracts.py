"""Public contracts for trusted model plugins."""
from __future__ import annotations
from typing import Any, Protocol

class ModelPlugin(Protocol):
    id: str
    version: str
    def validate(self, parameters: dict[str, Any]) -> None: ...
    def calculate(self, parameters: dict[str, Any]) -> dict[str, Any]: ...
