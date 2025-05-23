class AdminService{

    private baseUrl: string;

    constructor(url:string){
        this.baseUrl=url;
    }

    async getMonitoredUsers(token: string){
        const response = await fetch(`${this.baseUrl}/monitored-users`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.json();
    }
}

export default AdminService;