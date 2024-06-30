# MINI CLOUD WEB APP FOR OPENSTACK

## Chạy front end 

```
cd transit-ui 
npm i 
npm start
```

## Chạy back end 

```
cd transit-backend 
python3 -m venv venv 
source venv/bin/activate 
pip install -e . 
fastapi run 
```