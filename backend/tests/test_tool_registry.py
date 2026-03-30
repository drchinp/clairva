from app.mcp.register_tools import register_all_tools
from app.mcp.tool_registry import tool_registry

print("\nRegistering tools...\n")

register_all_tools()

print("\nRegistered tools:")
print(tool_registry.list_tools())

print("\nTool descriptions:")
print(tool_registry.list_tool_descriptions())