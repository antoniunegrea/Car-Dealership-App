class ServerService{
    private baseUrl: string;

    constructor(url:string){
        this.baseUrl=url;
    }

    async isServerOnline(): Promise<boolean> {
        try {
            console.log("checking server...")
            const response = await fetch(`${this.baseUrl}/health`, {
                method: 'GET',
            });
            return response.ok;
        } catch (error) {
            console.error('Server check failed:', error);
            return false;
        }
    }
}

export default ServerService;