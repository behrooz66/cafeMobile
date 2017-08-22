export class Settings 
{
    //static apiBase = "http://localhost:5001/api/";
    static apiBase = "http://cafeserver.azurewebsites.net/Api/api/";
    
    //static tokenEndpoint = "http://localhost:5000/connect/token";
    static tokenEndpoint = "http://cafeserver.azurewebsites.net/AuthServer/connect/token";

    static loginInfo = 
    {
        client_id: "resourceOwner",
        client_secret: "secret",
        scope: "api+offline_access"
    }

    static geocoder = 
    {
        apiUrl: "http://geocoder.ca/?locate=",
        authToken: "xxx",
        minimumConfidence: 0.8
    }

    static customers = 
    {
        showDeletedCustomers: false,
        pageSize : 10
    }

    static orders = 
    {
        showDeletedOrders: true,
        pageSize: 10
    }

    static giftcards = 
    {
        showDeletedGiftCards: true,
        pageSize: 10
    }

    static reservations = 
    {
        byDate: 
        {
                startDate: null,
                endDate: null
        },
        showDeletedReservations: true,
        pageSize: 10
    }

    static messages = 
    {
        pageSize: 5
    }
}