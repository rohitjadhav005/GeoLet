import json
from pathlib import Path
from database import SessionLocal, Conflict, engine, Base

def seed_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    # Load JSON
    filepath = Path(__file__).parent / "data" / "conflicts.json"
    if filepath.exists():
        with open(filepath, "r", encoding="utf-8") as f:
            data = json.load(f)
            
            for item in data:
                # Check if it exists
                existing = db.query(Conflict).filter(Conflict.id == item["id"]).first()
                if not existing:
                    new_conflict = Conflict(
                        id=item["id"],
                        country=item["country"],
                        iso=item.get("iso", ""),
                        data=item
                    )
                    db.add(new_conflict)
        db.commit()
        print("Database seeded successfully with conflicts!")
    else:
        print("conflicts.json not found.")
    
    db.close()

if __name__ == "__main__":
    seed_db()
