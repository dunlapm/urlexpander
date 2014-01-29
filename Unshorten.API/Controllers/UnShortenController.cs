using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Caching;
using System.Web.Http;
using System.Web.Http.Cors;
using Unshorten.API.Models;

namespace Unshorten.API.Controllers {
    class MyWebClient : WebClient {
        Uri _responseUri;

        public Uri ResponseUri {
            get { return _responseUri; }
        }

        protected override WebResponse GetWebResponse(WebRequest request) {
            WebResponse response = base.GetWebResponse(request);
            _responseUri = response.ResponseUri;
            return response;
        }

    }


    
    [EnableCors("*","GET", "*")]
    public class UnShortenController : ApiController {

        // GET api/UnShorten?url=http://goo.gl/fbsS
        public async Task<ShortUrl> Get(string url) {
            var cache = HttpRuntime.Cache[url];
            if (cache == null) {
                //HttpClient httpClient = new HttpClient();
                var request = (HttpWebRequest)HttpWebRequest.Create(url);
                request.Method = "HEAD";
                request.AllowAutoRedirect = true;
                //HttpRequestMessage request =
                //   new HttpRequestMessage(HttpMethod.Get,
                //      new Uri(url));
                //HttpResponseMessage response = await httpClient.GetAsync(url);
                WebResponse response = null;
                try {
                    response = await request.GetResponseAsync();
                    cache = new ShortUrl {
                        ShortURL = url,
                        LongURL = response.ResponseUri.AbsoluteUri
                        //LongURL = response.Headers["Location"]
                    };
                } catch (WebException we) {
                    var eResponse = we.Response;
                } finally {
                    if (response != null) {
                        response.Dispose();
                    }
                }
                
                
            }

            return cache as ShortUrl;
        }
    }
}
