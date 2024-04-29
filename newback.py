from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from google.cloud import firestore
import json
from datetime import datetime, timezone
import random
from fastapi.middleware.cors import CORSMiddleware
import time

origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:8081",
    "http://192.168.1.16"
    "http://172.16.1.214"
    "/http://34.100.142.172"

]



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

db = firestore.Client()

def custom_json_serializer(obj):
    if isinstance(obj, datetime):
        # Serialize datetime objects with timezone information
        return obj.strftime('%Y-%m-%d %H:%M:%S %Z')
    elif isinstance(obj, bytes):
        # Handle bytes objects if needed
        return obj.decode()
    else:
        # For other types, use default serialization
        return str(obj)


@app.get("/test")
async def fetch_all_documents():
    try:
        collection1_docs = db.collection('executives').stream()
        collection2_docs = db.collection('drinktypes').stream()
        collection3_docs = db.collection('shops').stream()
        collection4_docs = db.collection('routes').stream()
        collection5_docs = db.collection('managers').stream()

        
        all_documents = []
        for doc in collection1_docs:
            all_documents.append(doc.to_dict())
        for doc in collection2_docs:
            all_documents.append(doc.to_dict())
        for doc in collection3_docs:
            all_documents.append(doc.to_dict())
        for doc in collection4_docs:
            all_documents.append(doc.to_dict())
        for doc in collection5_docs:
            all_documents.append(doc.to_dict())

        print(all_documents)

        json_data = json.dumps(all_documents,default=custom_json_serializer)
        json_without_slash = json.loads(json_data)

        # Return JSON response
        return JSONResponse(content=json_without_slash)
    except Exception as e:
        return JSONResponse(content={"error": str(e)})

@app.get("/latestcount")
async def latest_route_integer_count():
    try:
        latest_route_doc = db.collection('routes').order_by('time', direction=firestore.Query.DESCENDING).limit(1).get()[0]
        route_string = latest_route_doc.get('route')
        integer_count = len([int(num) for num in route_string.split('-') if num.isdigit()])

        return JSONResponse(content={"integer_count": integer_count,"route":route_string})
    except Exception as e:
        return JSONResponse(content={"error": str(e)})
    

@app.get("/masterdata/old")
async def latest_route_integer_count():
    try:
        # Fetch the latest route document
        latest_route_doc = db.collection('routes').order_by('time', direction=firestore.Query.DESCENDING).limit(1).get()[0]
        route_string = latest_route_doc.get('route')
        delivery_map = latest_route_doc.get('deliverydetails')
        assigned_string = latest_route_doc.get('assigned_by')
        
        # Extract shop IDs from route string
        shop_ids = [int(num) for num in route_string.split('-') if num.isdigit()]
        
        # Fetch shop documents based on id_alt values
        shops_ref = db.collection('shops')
        shop_data = []
        for shop_id in shop_ids:
            query = shops_ref.where('id_alt', '==', shop_id).limit(1).get()
            if not query:
                raise HTTPException(status_code=404, detail=f"Shop with id_alt {shop_id} not found")
            shop_doc = query[0]
            shop_data.append({"name": shop_doc.get('name'), "location": shop_doc.get('location')})
        
        # Fetch username from the same document where route_string is fetched
        username = latest_route_doc.get('username')

        # Fetch the executive document using the username
        executive_ref = db.collection('executives').where('username', '==', username).limit(1).get()
        if not executive_ref:
            raise HTTPException(status_code=404, detail=f"Executive with username {username} not found")
        
        manager_ref = db.collection('managers').where('username', '==', assigned_string).limit(1).get()
        if not manager_ref:
            raise HTTPException(status_code=404, detail=f"Manager with username {assigned_string} not found")
        
        manager_doc = manager_ref[0]
        manager_name = manager_doc.get('fullname')
        executive_doc = executive_ref[0]
        executive_name = executive_doc.get('name')

        integer_count = len(shop_ids)

        return JSONResponse(content={
            "integer_count": integer_count,
            "route": route_string,
            "shops": shop_data,
            "executive_username": username,
            "executive_name": executive_name,
            "assigned_by": manager_name,
            "delivery_details": delivery_map  # Include delivery details in the response
        })
    except Exception as e:
        return JSONResponse(content={"error": str(e)})



@app.get("/masterdata")
async def latest_route_integer_count():
    try:
        # Fetch the latest route document
        latest_route_doc = db.collection('routes').order_by('time', direction=firestore.Query.DESCENDING).limit(1).get()[0]
        route_string = latest_route_doc.get('route')
        delivery_map = latest_route_doc.get('deliverydetails')
        assigned_string = latest_route_doc.get('assigned_by')
        
        # Extract shop IDs from route string and fetch shop documents
        shop_ids = [int(num) for num in route_string.split('-') if num.isdigit()]
        shops_ref = db.collection('shop_real')
        shop_data = []
        for shop_id in shop_ids:
            query = shops_ref.where('Sno', '==', shop_id).limit(1).get()
            if not query:
                raise HTTPException(status_code=404, detail=f"Shop with id_alt {shop_id} not found")
            shop_doc = query[0]
            shop_name = shop_doc.get('Name')
            shop_location = shop_doc.get('Location')
            shop_data.append({"name": shop_name, "location": shop_location})

        # Fetch username and manager information
        username = latest_route_doc.get('username')
        manager_ref = db.collection('managers').where('username', '==', assigned_string).limit(1).get()
        if not manager_ref:
            raise HTTPException(status_code=404, detail=f"Manager with username {assigned_string} not found")
        manager_doc = manager_ref[0]
        manager_name = manager_doc.get('fullname')

        # Fetch executive information
        executive_ref = db.collection('executives').where('username', '==', username).limit(1).get()
        if not executive_ref:
            raise HTTPException(status_code=404, detail=f"Executive with username {username} not found")
        executive_doc = executive_ref[0]
        executive_name = executive_doc.get('name')
        delivery_details_with_names = {}
        for shop_id, delivery_info in delivery_map.items():
            if str(shop_id) in route_string:
                index = route_string.split("-").index(str(shop_id))
                shop_name = shop_data[index]['name']
                delivery_details_with_names[shop_name] = delivery_info

        integer_count = len(shop_data)
        dri_doc = db.collection('drinktypes').document('jJWTsDbi1B0Cczyweq7g').get().to_dict()
        notes='this is a mockup of the structure'
        return JSONResponse(content={
            "integer_count": integer_count,
            "route": route_string,
            "shops": shop_data,
            "executive_username": username,
            "executive_name": executive_name,
            "assigned_by": manager_name,
            "delivery_details": delivery_details_with_names,
            "drinknames":dri_doc,
            "notes":notes
        })
    except Exception as e:
        return JSONResponse(content={"error": str(e)})

@app.get("/masterdata/executive/{execname}")
async def executive_masterdata(execname: str):
    try:
        # Check if the executive exists in the database
        
        executive_ref = db.collection('executives').where('username', '==', execname).limit(1).get()
        if not executive_ref:
            raise HTTPException(status_code=500, detail=f"Executive with username {execname} not found")

        # Fetch the latest route document for the specified executive
        query = db.collection('routes').where('username', '==', execname).order_by('time', direction=firestore.Query.DESCENDING).limit(1).get()
        if not query:
            # If no route document found, return a specific message
            return JSONResponse(content={"message": f"No latest route found for executive {execname}"})
        
        latest_route_doc = query[0]
        route_string = latest_route_doc.get('route')
        delivery_map = latest_route_doc.get('deliverydetails')
        assigned_string = latest_route_doc.get('assigned_by')
        
        # Extract shop IDs from route string and fetch shop documents
        shop_ids = [int(num) for num in route_string.split('-') if num.isdigit()]
        shops_ref = db.collection('shop_real')
        shop_data = []
        for shop_id in shop_ids:
            query = shops_ref.where('Sno', '==', shop_id).limit(1).get()
            if not query:
                raise HTTPException(status_code=500, detail=f"Shop with id_alt {shop_id} not found")
            shop_doc = query[0]
            shop_name = shop_doc.get('Name')
            shop_location = shop_doc.get('Location')
            shop_data.append({"name": shop_name, "location": shop_location})

        # Fetch manager information
        manager_ref = db.collection('managers').where('username', '==', assigned_string).limit(1).get()
        if not manager_ref:
            raise HTTPException(status_code=500, detail=f"Manager with username {assigned_string} not found")
        manager_doc = manager_ref[0]
        manager_name = manager_doc.get('fullname')

        # Fetch executive information
        executive_name = latest_route_doc.get('username')

        # Map delivery details with shop names
        delivery_details_with_names = {}
        for shop_id, delivery_info in delivery_map.items():
            if str(shop_id) in route_string:
                index = route_string.split("-").index(str(shop_id))
                shop_name = shop_data[index]['name']
                delivery_details_with_names[shop_name] = delivery_info

        # Get drink names document
        dri_doc = db.collection('drinktypes').document('jJWTsDbi1B0Cczyweq7g').get().to_dict()

        # Return response
        integer_count = len(shop_data)
        notes = f'data for {execname}'
        return JSONResponse(content={
            "integer_count": integer_count,
            "route": route_string,
            "shops": shop_data,
            "executive_username": execname,
            "executive_name": executive_name,
            "assigned_by": manager_name,
            "delivery_details": delivery_details_with_names,
            "drinknames": dri_doc,
            "notes": notes
        })

    except Exception as e:
        return JSONResponse(content={"error": str(e)})



@app.get("/drinknames")
async def drinksss():
    try:
        dri_doc = db.collection('drinktypes').document('jJWTsDbi1B0Cczyweq7g').get().to_dict()
        
        if dri_doc:
            return dri_doc
        else:
            # not found
            raise HTTPException(status_code=404, detail="Drink types document not found")
 
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch drink data: {str(e)}")


@app.get("/privacypolicynew")
async def ppolicy():
    pp={'text':'''Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Aliquet risus feugiat in ante metus dictum at tempor. Integer enim neque volutpat ac tincidunt vitae. Vitae purus faucibus ornare suspendisse sed nisi. Proin sed libero enim sed faucibus turpis in eu mi. Ut diam quam nulla porttitor massa id neque aliquam. Pretium nibh ipsum consequat nisl. Eget aliquet nibh praesent tristique. Elit at imperdiet dui accumsan sit amet. Mi bibendum neque egestas congue. Tempus imperdiet nulla malesuada pellentesque elit eget. Id aliquet risus feugiat in ante metus dictum at. Ut sem nulla pharetra diam sit amet. Tristique et egestas quis ipsum suspendisse ultrices gravida dictum. Varius quam quisque id diam vel. A cras semper auctor neque vitae tempus quam. Amet tellus cras adipiscing enim eu turpis egestas pretium aenean.

Ut faucibus pulvinar elementum integer enim neque volutpat ac. Sodales neque sodales ut etiam. Pellentesque eu tincidunt tortor aliquam nulla facilisi cras fermentum odio. Ut lectus arcu bibendum at varius vel pharetra vel. Lacus luctus accumsan tortor posuere ac. Fermentum leo vel orci porta non pulvinar. Arcu dui vivamus arcu felis. Aliquet eget sit amet tellus cras adipiscing. Pharetra magna ac placerat vestibulum lectus mauris. Ultricies tristique nulla aliquet enim tortor at. Eget velit aliquet sagittis id consectetur purus ut faucibus.

Elit pellentesque habitant morbi tristique senectus et netus et. Porttitor leo a diam sollicitudin tempor id eu nisl. Pulvinar sapien et ligula ullamcorper malesuada proin. Sit amet nisl suscipit adipiscing. Id faucibus nisl tincidunt eget nullam non nisi. Sollicitudin aliquam ultrices sagittis orci a scelerisque purus semper. Aenean pharetra magna ac placerat vestibulum lectus. Massa sed elementum tempus egestas sed sed risus pretium quam. Risus sed vulputate odio ut enim blandit volutpat. Id donec ultrices tincidunt arcu non sodales.

Vitae elementum curabitur vitae nunc sed velit. Amet nisl suscipit adipiscing bibendum est. Aliquam id diam maecenas ultricies mi. Id porta nibh venenatis cras sed felis eget velit aliquet. Ac odio tempor orci dapibus ultrices in. Aliquam sem fringilla ut morbi. Et leo duis ut diam quam. Ultrices sagittis orci a scelerisque purus. Aliquet lectus proin nibh nisl condimentum id venenatis. Feugiat nibh sed pulvinar proin gravida hendrerit lectus. Sagittis orci a scelerisque purus. Arcu dui vivamus arcu felis bibendum ut tristique. Penatibus et magnis dis parturient montes. Tincidunt tortor aliquam nulla facilisi cras. Pulvinar elementum integer enim neque volutpat.

Posuere ac ut consequat semper viverra. Phasellus egestas tellus rutrum tellus pellentesque. Tempus iaculis urna id volutpat lacus laoreet. Non quam lacus suspendisse faucibus. In nibh mauris cursus mattis molestie. Malesuada fames ac turpis egestas sed tempus. Egestas fringilla phasellus faucibus scelerisque eleifend. Pretium lectus quam id leo in vitae turpis massa sed. Aliquam eleifend mi in nulla posuere sollicitudin aliquam. Tincidunt eget nullam non nisi est sit amet facilisis magna. Arcu bibendum at varius vel pharetra vel turpis nunc eget. Tempus egestas sed sed risus pretium quam vulputate. Mauris commodo quis imperdiet massa tincidunt nunc pulvinar sapien et. Sed odio morbi quis commodo odio aenean sed. Enim eu turpis egestas pretium aenean. Nec sagittis aliquam malesuada bibendum arcu vitae elementum curabitur vitae.

Scelerisque eleifend donec pretium vulputate sapien nec. Lacus laoreet non curabitur gravida arcu ac. Id eu nisl nunc mi ipsum faucibus vitae aliquet. Rhoncus mattis rhoncus urna neque viverra. Cras tincidunt lobortis feugiat vivamus at augue eget arcu dictum. Nunc scelerisque viverra mauris in aliquam sem fringilla. Turpis egestas pretium aenean pharetra. Amet justo donec enim diam vulputate ut pharetra sit. Augue ut lectus arcu bibendum at. Ornare arcu dui vivamus arcu felis bibendum ut tristique.

In hac habitasse platea dictumst vestibulum rhoncus est pellentesque elit. Nunc id cursus metus aliquam eleifend mi in. Eu sem integer vitae justo eget magna fermentum iaculis. Leo vel orci porta non pulvinar neque laoreet suspendisse interdum. Adipiscing elit duis tristique sollicitudin nibh sit amet commodo. Vehicula ipsum a arcu cursus vitae. Condimentum lacinia quis vel eros donec ac odio tempor. Gravida in fermentum et sollicitudin ac orci. Et magnis dis parturient montes nascetur ridiculus mus. Libero enim sed faucibus turpis in eu mi bibendum neque. Tortor posuere ac ut consequat semper viverra. Suscipit tellus mauris a diam maecenas sed. Morbi tristique senectus et netus. Auctor neque vitae tempus quam pellentesque nec. Tellus elementum sagittis vitae et leo duis ut diam quam. Massa tincidunt dui ut ornare lectus sit amet est. Non tellus orci ac auctor.

Aliquam ut porttitor leo a. Sed odio morbi quis commodo odio aenean sed adipiscing diam. Dui nunc mattis enim ut. Tincidunt ornare massa eget egestas purus viverra accumsan. Commodo elit at imperdiet dui. Integer vitae justo eget magna fermentum iaculis eu. Sed sed risus pretium quam vulputate dignissim suspendisse in est. Pellentesque massa placerat duis ultricies lacus sed. Tellus cras adipiscing enim eu turpis egestas pretium. Pellentesque habitant morbi tristique senectus et netus et malesuada fames. Aliquet eget sit amet tellus cras adipiscing enim eu turpis. Elementum eu facilisis sed odio. Molestie a iaculis at erat pellentesque adipiscing commodo elit.

Facilisis leo vel fringilla est ullamcorper eget nulla. In iaculis nunc sed augue lacus viverra vitae. Vitae justo eget magna fermentum iaculis eu non diam phasellus. Sagittis id consectetur purus ut faucibus pulvinar elementum. Viverra vitae congue eu consequat ac felis donec et odio. Molestie at elementum eu facilisis sed odio. Libero id faucibus nisl tincidunt eget nullam non. Quis risus sed vulputate odio ut enim blandit. Porttitor leo a diam sollicitudin tempor id. Vitae semper quis lectus nulla at volutpat diam ut. Turpis nunc eget lorem dolor sed. Sollicitudin tempor id eu nisl nunc mi ipsum faucibus vitae.

Sed viverra ipsum nunc aliquet bibendum enim facilisis. Egestas fringilla phasellus faucibus scelerisque eleifend donec. Vitae proin sagittis nisl rhoncus mattis rhoncus urna. Tempus egestas sed sed risus pretium quam. At consectetur lorem donec massa sapien faucibus et molestie ac. Ut pharetra sit amet aliquam. Rhoncus urna neque viverra justo nec. Sodales ut eu sem integer. A erat nam at lectus urna duis convallis convallis tellus. Id neque aliquam vestibulum morbi blandit cursus. Egestas fringilla phasellus faucibus scelerisque eleifend donec pretium vulputate. Blandit aliquam etiam erat velit scelerisque in dictum non.'''}
    time.sleep(2)
    return pp


@app.get("/random-response")
async def random_response():
    # Generate a random number (0 or 1)
    random_number = random.randint(0, 1)    
    time.sleep(2)
    
    # Return "success" if random_number is 0, else return "error"
    if random_number == 0:
        return {"response": "success"}
    else:
        # Return HTTP 500 Internal Server Error for error response
        raise HTTPException(status_code=500, detail="alalalala")