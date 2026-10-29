"""Trusted reference plugin. Existing JS experiments are intentionally unchanged."""
from __future__ import annotations
import math
from .registry import registry

class UniformMotion:
    id = 'physics.uniform_motion'
    version = '1.0.0'

    def validate(self, parameters):
        for key in ('v0', 'a', 't'):
            v = parameters.get(key)
            if isinstance(v, bool) or not isinstance(v, (int, float)) or not math.isfinite(v):
                raise ValueError(f'{key} must be a finite number')
        if not 0 <= parameters['t'] <= 100:
            raise ValueError('t must be between 0 and 100')

    def calculate(self, parameters):
        self.validate(parameters)
        v0, a, t = (parameters[k] for k in ('v0', 'a', 't'))
        return {'displacement': v0*t + 0.5*a*t*t, 'velocity': v0+a*t}

registry.register(UniformMotion())
