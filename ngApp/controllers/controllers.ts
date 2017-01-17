namespace nbaplayoffs.Controllers {

    export class HomeController {
        public message = 'Welcome To The Nba Playoffs History!';
        public nbaseries

        constructor(private $http:ng.IHttpService) {
            $http.get('/nbaseries').then((res)=>{
                console.log(res.data);
                this.nbaseries = res.data;

            })
        }
    }


    export class AboutController {
        public message = 'Hello from the about page!';
    }

}
