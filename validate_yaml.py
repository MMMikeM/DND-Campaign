import yaml
import sys

# Try to load the YAML file
try:
    with open('shattered-spire-quests.yaml', 'r') as file:
        content = file.read()
    
    # Try to parse the YAML
    parsed_yaml = yaml.safe_load(content)
    print("YAML is valid!")
    
    # If successful, dump it back with proper formatting
    with open('fixed-shattered-spire-quests.yaml', 'w') as outfile:
        yaml.dump(parsed_yaml, outfile, default_flow_style=False, sort_keys=False, indent=2)
    
    print("Fixed YAML saved to fixed-shattered-spire-quests.yaml")

except yaml.YAMLError as e:
    print(f"YAML validation error: {e}")
    # Print line number and problem if available
    if hasattr(e, 'problem_mark'):
        mark = e.problem_mark
        print(f"Error position: line {mark.line+1}, column {mark.column+1}")
        print(f"Problem: {e.problem}")
        
        # Print the problematic lines
        with open('shattered-spire-quests.yaml', 'r') as file:
            lines = file.readlines()
            context_start = max(0, mark.line - 2)
            context_end = min(len(lines), mark.line + 3)
            
            print("\nProblematic section:")
            for i in range(context_start, context_end):
                prefix = ">>> " if i == mark.line else "    "
                print(f"{prefix}{i+1}: {lines[i].rstrip()}")
except Exception as e:
    print(f"Other error: {e}") 