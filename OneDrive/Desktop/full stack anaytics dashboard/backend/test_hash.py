from auth import get_password_hash
import sys

def test_hash():
    try:
        pw = "testpassword123"
        print(f"Hashing password: {pw}")
        h = get_password_hash(pw)
        print(f"Hashed: {h}")
        
        print("Testing None input...")
        try:
            get_password_hash(None)
        except Exception as e:
            print(f"Caught expected error for None: {e}")
            
    except Exception as e:
        print(f"Test failed: {e}")

if __name__ == "__main__":
    test_hash()
