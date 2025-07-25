import os
import sys
from pathlib import Path

def setup_environment():
    """Set up the development environment."""
    # Get the backend directory
    backend_dir = Path(__file__).parent.absolute()
    project_root = backend_dir.parent
    
    # Create .env file if it doesn't exist
    env_file = backend_dir / '.env'
    if not env_file.exists():
        groq_key = input("Please enter your Groq API key: ").strip()
        
        with open(env_file, 'w') as f:
            f.write(f"GROQ_API_KEY={groq_key}\n")
        print("Created .env file with Groq API key")
    
    # Create virtual environment if it doesn't exist
    venv_dir = project_root / 'venv'
    if not venv_dir.exists():
        print("Creating virtual environment...")
        os.system(f"{sys.executable} -m venv {venv_dir}")
        print("Virtual environment created")
    
    # Install requirements and backend package
    pip_cmd = str(venv_dir / "Scripts" / "pip") if os.name == 'nt' else str(venv_dir / "bin" / "pip")
    os.system(f"{pip_cmd} install -r {backend_dir}/requirements.txt")
    os.system(f"{pip_cmd} install -e {project_root}")
    print("Installed requirements and backend package")
    
    print("\nSetup complete! You can now run the backend server with:")
    print("1. Activate the virtual environment:")
    if os.name == 'nt':
        print("   .\\venv\\Scripts\\activate")
    else:
        print("   source venv/bin/activate")
    print("2. Start the server:")
    print("   cd backend")
    print("   python run.py")

if __name__ == "__main__":
    setup_environment() 