"""Explicit in-process registry; do not run uploaded/untrusted code."""
from __future__ import annotations
from .contracts import ModelPlugin

class PluginRegistry:
    def __init__(self):
        self._plugins: dict[str, ModelPlugin] = {}

    def register(self, plugin: ModelPlugin) -> None:
        name = getattr(plugin, 'id', None)
        if not isinstance(name, str) or not name or not getattr(plugin, 'version', None):
            raise ValueError('Plugin must provide id and version')
        if not callable(getattr(plugin, 'validate', None)) or not callable(getattr(plugin, 'calculate', None)):
            raise TypeError('Plugin must implement validate and calculate')
        if name in self._plugins:
            raise ValueError('Duplicate plugin id: ' + name)
        self._plugins[name] = plugin

    def get(self, name: str) -> ModelPlugin:
        try:
            return self._plugins[name]
        except KeyError:
            raise KeyError('Unknown model plugin: ' + name) from None

    def metadata(self) -> list[dict[str, str]]:
        return [{'id': p.id, 'version': p.version} for p in self._plugins.values()]

registry = PluginRegistry()
