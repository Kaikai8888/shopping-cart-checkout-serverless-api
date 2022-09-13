# Shopping Cart Checkout API
This is a serverless RESTful API, which is developed by Node.js and MongoDB, and deployed to AWS Lambda and AWS API Gateway. 

Demo API endpoint: https://qn8no7wk79.execute-api.ap-southeast-1.amazonaws.com

## Prerequisite
* AWS account
* [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
* [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
* [Node 16.17.0](https://nodejs.org/en/download/)
* npm
* [MongoDB Atlas account](https://www.mongodb.com/atlas/database)

## Deploy
1. **create database on MongoDB Atlas**:
> * create database user and give user `Atlas admin` permission
> * add `0.0.0.0/0` to IP access list, as we currently we don't fix AWS Lambda's IP address

2. **update settings in api/config/settings.js**
(1) **jwt_secret**
(2) **mongodb_uri**: go to `Database` tab > click `connect` > click `Connect your application` > copy connection string as below, and replace `<password>` section with user password

3. **enter `/api` folder to install Node packages**
```bash
cd api
npm install
```

4. **build and deploy API to AWS**
```bash
cd ..
sam build
sam deploy --guided
```
then follow the guidance to deploy

5. **get API endpoint** from [AWS API Gateway console](https://aws.amazon.com/tw/api-gateway/)

6. access API endpoint (`GET /`), and should receive `This is shopping cart checkout API endpoint.`

7. **(optional) create API user** with below command, and follow the prompt to input user info
```bash
npm create-api-user
```

## API documentation
**Endpoint**: Please go to AWS API Gateway console to get the endpoint after deployment

### Authenticate
Generate JWT token with API user account.
* **HTTP Method**: POST
* **Path**: /api/authenticate
* **Request Body**: 

| API Fields | Type   | Mandatory | Details |
| -----------|--------|-----------|---------|
| email      | string | yes       | API user email |
| password   | string | yes       | API user password|

* **Request Body Example**:
```json
{
  "email": "test-api-user@example.com",
  "password": "fkeopvirofds"
}
```
* **Response Body**:

**Success**: 
| API Fields | Type   | Details |
| -----------|--------|----------|
| status     | string | 'success'|
| token      | string | access token to use for below APIs (will timeout after 1 day)|

Example:
```json
{
    "status": "success",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzMWRhNzJjYWIxZWFiMmZhOWRkMDI5MiIsIm5hbWUiOiJ0ZXN0LWFwaS11c2VyIiwiaWF0IjoxNjYzMDMzNDk1LCJleHAiOjE2NjMxMTk4OTV9.uuMv4kLayEibFfcmaNIcB3zTto8AumMEwBfSPFqCEUk"
}
```
**Error**:
| API Fields | Type   | Details |
| -----------|--------|----------|
| status     | string | 'error'|
| message    | string | error message|

Example:
```json
{
    "status": "error",
    "message": "Internal error occurred"
}
```


### Create User
Create normal user (not API user)
* **HTTP Method**: POST
* **Path**: /api/user
* **Request Header Authorization**: Bearer token
* **Request Body**: 

| API Fields | Type   | Mandatory | Details |
| -----------|--------|-----------|---------|
| name       | string | yes       | user name  |
| email      | string | yes       | user email (cannot use duplicate email)|
| password   | string | yes       | user password (>= 8 characters)|

* **Request Body Example**:
```json
{
  "name": "test1",
  "email": "test1@example.com",
  "password": "frejiotvujekl"
}
```
* **Response Body**:

**Success**: 
| API Fields | Type   | Details |
| -----------|--------|----------|
| status     | string | 'success'|
| result     | string | contains user id |

Example:
```json
{
    "status": "success",
    "result": {
        "id": "631fe292df4d0a3bbfd4c803"
    }
}
```
**Error**:
| API Fields | Type   | Details |
| -----------|--------|----------|
| status     | string | 'error'|
| message    | string| error message|

Example:
```json
{
    "status": "error",
    "message": "Internal error occurred"
}
```


### Delete User
Delete normal user (not API user)
* **HTTP Method**: DELETE
* **Path**: /api/user/:id
* **Request Header Authorization**: Bearer token
* **Response Body**:

**Success**: 
| API Fields | Type   | Details |
| -----------|--------|----------|
| status     | string | 'success'|

Example:
```json
{
    "status": "success",
}
```
**Error**:
| API Fields | Type   | Details |
| -----------|--------|----------|
| status     | string | 'error'|
| message    | string | error message|

Example:
```json
{
    "status": "error",
    "message": "Internal error occurred"
}
```

### Create Product
* **HTTP Method**: POST
* **Path**: /api/product
* **Request Header Authorization**: Bearer token
* **Request Body**: 

| API Fields | Type   | Mandatory | Details |
| -----------|--------|-----------|---------|
| name       | string | yes       | product name  |
| price      | number | yes       | product price |
| quantity   | number | yes       | product quantity (>= 0)|

* **Request Body Example**:
```json
{
  "name": "product1",
  "price": 100,
  "quantity": 10
}
```
* **Response Body**:

**Success**: 
| API Fields | Type   | Details |
| -----------|--------|----------|
| status     | string | 'success'|
| result     | object | contains product id |

Example:
```json
{
    "status": "success",
    "result": {
        "id": "631fe559be9fbd2b282e8662"
    }
}
```
**Error**:
| API Fields | Type   | Details |
| -----------|--------|----------|
| status     | string | 'error'|
| message    | string | error message|

Example:
```json
{
    "status": "error",
    "message": "Internal error occurred"
}
```

### Delete Product
* **HTTP Method**: DELETE
* **Path**: /api/product/:id
* **Request Header Authorization**: Bearer token
* **Response Body**:

**Success**: 
| API Fields | Type   | Details |
| -----------|--------|----------|
| status     | string | 'success'|

Example:
```json
{
    "status": "success",
}
```
**Error**:
| API Fields | Type   | Details |
| -----------|--------|----------|
| status     | string | 'error'|
| message    | string | error message|

Example:
```json
{
    "status": "error",
    "message": "Internal error occurred"
}
```


### Create Order
* **HTTP Method**: POST
* **Path**: /api/order
* **Request Header Authorization**: Bearer token
* **Request Body**: 

| API Fields | Type   | Mandatory | Details |
| -----------|--------|-----------|---------|
| user_id    | string | yes       | user id  |
| items      | array of object | yes       | item object format as below |

Item object format:
| API Fields | Type   | Mandatory | Details |
| -----------|--------|-----------|---------|
| id         | string | yes       | product id  |
| quantity   | number | yes       | order item quantity|

* **Request Body Example**:
```json
{
    "user_id": "631dcbc8b342def26e656b9b",
    "items": [{
        "id": "631fe559be9fbd2b282e8662",
        "quantity": 10
    }]
}
```
* **Response Body**:

**Success**: 
| API Fields | Type   | Details |
| -----------|--------|----------|
| status     | string | 'success'|
| result     | object | contains order id |

Example:
```json
{
    "status": "success",
    "result": {
        "id": "631fe567be9fbd2b282e8668"
    }
}
```
**Error**:
| API Fields | Type   | Details |
| -----------|--------|----------|
| status     | string | 'error'|
| message    | string | error message|

Example:
```json
{
    "status": "error",
    "message": "Internal error occurred"
}
```

### Get Order
* **HTTP Method**: GET
* **Path**: /api/order
* **Request Header Authorization**: Bearer token
* **Response Body**:

**Success**: 
| API Fields | Type   | Details |
| -----------|--------|----------|
| status     | string | 'success'|
| result     | array of object | contains order info |

Order info object format
| API Fields | Type   | Details |
| -----------|--------|----------|
| _id        | string | order id |
| user       | object | user info |
| created_at | string | order created timestamp |
| update_at  | string | order updated timestamp |
| items      | array of object | ordered items' info |

User info object format
| API Fields | Type   | Details |
| -----------|--------|----------|
| _id        | string | user id |
| name  | string | user name |
| email  | string | user email |

Ordered Item object format
| API Fields | Type   | Details |
| -----------|--------|----------|
| _id    | string | order item id (the id of relation between order and product) |
| order  | string | order id |
|product | object | ordered item's product info|
|price   | number | ordered price              |
|quantity| number | ordered quantity           |

Product info object format
| API Fields | Type   | Details |
| -----------|--------|----------|
| _id        | string | product id |
| name  | string | product name |


Example:
```json
{
    "status": "success",
    "result": [
        {
            "_id": "631dde1b689d01c2eac50059",
            "user": {
                "_id": "631dc71fef232d2d26a10279",
                "name": "test1",
                "email": "test1@example.com"
            },
            "created_at": "2022-09-11T13:09:47.040Z",
            "updated_at": "2022-09-11T13:09:47.040Z",
            "items": [
                {
                    "_id": "631dde1b689d01c2eac5005b",
                    "order": "631dde1b689d01c2eac50059",
                    "product":  {
                        "_id": "631fe559be9fbd2b282e8662",
                        "name": "product4"
                    },
                    "price": 10,
                    "quantity": 8
                },
                {
                    "_id": "631dde1b689d01c2eac5005c",
                    "order": "631dde1b689d01c2eac50059",
                    "product": {
                        "_id": "631dd20e227f1c538685265f",
                        "name": "product1"
                    },
                    "price": 120,
                    "quantity": 7
                }
            ]
        },
    ]
}
```
**Error**:
| API Fields | Type   | Details |
| -----------|--------|----------|
| status     | string | 'error'|
| message    | string | error message|

Example:
```json
{
    "status": "error",
    "message": "Internal error occurred"
}
```




## Test

### Suggested Test Cases
#### Authenticate
1. authenticate with correct user info -> success
2. authenticate with wrong user info -> fail

#### User
##### without authentication: 
(clear the token in collection variable tab if using Postman test collection)
1. create user without authentication -> fail
2. delete user without authentication -> fail

##### authenticate and then:
3. create user -> success
4. create duplicate user -> fail
5. delete user -> success
6. delete user that has already been removed -> fail
6. delete user that has ordered products -> fail

#### Product
##### without authentication:
1. create product without authentication -> fail
2. delete product without authentication -> fail

##### authenticate and then:
3. create product -> success
4. delete product -> success
5. delete product that has already been removed -> fail
6. delete product that has been ordered -> fail

#### Order
##### without authentication:
1. create order without authentication -> fail
2. get order without authentication -> fail

##### authenticate and then:
3. create order on items with sufficient stock -> success
4. create order with out of stock item -> fail
5. create order with non existing product -> fail
6. create order with non existing user -> fail
6. concurrent order on the last item in stock -> only 1 order success, another will fail
7. get order -> success