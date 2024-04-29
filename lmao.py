from fastapi import FastAPI, status, HTTPException
from google.cloud import firestore

app = FastAPI()
db = firestore.Client()

DRIVER_COLLECTION = "main"
SHOP_COLLECTION = "shop_data"
driver_id='shaharhum'
@app.get("/shops/{driver_id}")
async def get_shop_count(driver_id: str):
    # Fetch driver details from Firestore
    driver_ref = db.collection(DRIVER_COLLECTION).document(driver_id)
    driver_doc = driver_ref.get()
    
    if not driver_doc.exists:
        raise HTTPException(status_code=404, detail="Driver not found")
    
    # Fetch shops data for the driver from Firestore
    sdeets_ref = driver_doc.reference.collection(SHOP_COLLECTION)
    shops_query = sdeets_ref.stream()
    
    # Calculate the number of shops
    shop_count = sum(1 for _ in shops_query)
    
    return {"driver_id": driver_id, "shop_count": shop_count}


@app.get("/total_bottles/{driver_id}")
async def get_total_bottles(driver_id: str):
    driver_ref = db.collection(DRIVER_COLLECTION).document(driver_id)
    driver_doc = driver_ref.get()
    
    if not driver_doc.exists:
        raise HTTPException(status_code=404, detail="Driver not found")
    
    # Fetch shops data for the driver from Firestore
    sdeets_ref = driver_doc.reference.collection(SHOP_COLLECTION)
    shops_query = sdeets_ref.stream()
    
    # Calculate the total number of bottles
    total_bottles = sum(doc.to_dict().get("items", 0) for doc in shops_query)
    
    return {"username": driver_id, "total_bottles": total_bottles}

@app.get("/driver_details/{driver_id}")
async def get_driver_details(driver_id: str):
    # Fetch driver details from Firestore
    driver_ref = db.collection(DRIVER_COLLECTION).document(driver_id)
    driver_doc = driver_ref.get()
    
    if not driver_doc.exists:
        raise HTTPException(status_code=404, detail="Driver not found")
    
    # Fetch shops data for the driver from Firestore
    sdeets_ref = driver_doc.reference.collection(SHOP_COLLECTION)
    shops_query = sdeets_ref.stream()
    
    # Organize driver details
    driver_details = driver_doc.to_dict()
    driver_details.pop("sdeets")  # Remove reference to subcollection
    
    # Organize shop details
    shops = []
    for shop_doc in shops_query:
        shop_details = shop_doc.to_dict()
        shops.append(shop_details)
    
    return {"driver_details": driver_details, "shops": shops}
