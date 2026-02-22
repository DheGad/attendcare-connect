import os
import glob

def replace_in_file(path):
    with open(path, 'r') as f:
        content = f.read()
    
    new_content = content.replace('contextEngine', 'patientCoreStore')
    new_content = new_content.replace('useContextEngine', 'usePatientCoreStore')
    
    if new_content != content:
        with open(path, 'w') as f:
            f.write(new_content)
        print(f"Updated {path}")

def main():
    base_dir = '/Users/DEERU/Documents/streetmp test/attendcare-connect/src'
    for root, dirs, files in os.walk(base_dir):
        for file in files:
            if file.endswith(('.ts', '.tsx')):
                replace_in_file(os.path.join(root, file))

if __name__ == '__main__':
    main()
