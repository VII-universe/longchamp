import os

file_path = '/Users/jakubfidler/Downloads/Long/src/App.tsx'

with open(file_path, 'r') as f:
    lines = f.readlines()

new_block = [
    '            <motion.path\n',
    '               key={`edge-${activeRoute}`}\n',
    '               d={route.path}\n',
    '               fill="none"\n',
    '               stroke="white"\n',
    '               strokeWidth="3"\n',
    '               strokeLinecap="round"\n',
    '               initial={{ pathLength: 0, opacity: 0 }}\n',
    '               animate={{ pathLength: 0.08, pathOffset: [0, 1] }}\n',
    '               transition={{ \n',
    '                 duration: route.pathAnimation.duration, \n',
    '                 ease: "linear",\n',
    '                 repeat: Infinity,\n',
    '                 repeatType: "loop"\n',
    '               }}\n',
    '            />\n'
]

# We know the block is around line 1070 (0-indexed 1069)
# Searching for the exact start of the block
start_idx = -1
for i, line in enumerate(lines):
    if 'key={`edge-${activeRoute}`}' in line:
        start_idx = i - 1 # Starting at <motion.path
        break

if start_idx != -1:
    end_idx = start_idx
    for i in range(start_idx, len(lines)):
        if '/>' in lines[i]:
            end_idx = i + 1
            break
    
    if end_idx > start_idx:
        lines[start_idx:end_idx] = new_block
        with open(file_path, 'w') as f:
            f.writelines(lines)
        print(f"SUCCESS: Replaced lines {start_idx+1} to {end_idx}")
    else:
        print("FAILURE: Could not find end of block")
else:
    print("FAILURE: Could not find key")
