class ServerService{
    private baseUrl: string;

    constructor(url:string){
        this.baseUrl=url;
    }

    async isServerOnline(): Promise<boolean> {
        try {
            const response = await fetch(`${this.baseUrl}/health`, {
                method: 'GET',
            });
            return response.ok;
        } catch (error) {
            return false;
        }
    }
}

export default ServerService;