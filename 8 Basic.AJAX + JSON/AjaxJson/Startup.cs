using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(AjaxJson.Startup))]
namespace AjaxJson
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            //ConfigureAuth(app);
        }
    }
}
