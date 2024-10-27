from sqlmodel import create_engine, SQLModel, Session
from core.config import settings



#  Engine is one for whole application
connection_string : str = str(settings.database_url).replace("postgresql", "postgresql+psycopg")
engine = create_engine(connection_string, connect_args={"sslmode":"require"}, pool_recycle=3000, pool_size=10, echo=True)

def create_table():
    SQLModel.metadata.create_all(engine)
    
def get_session():
    with Session(engine) as session:
        yield session