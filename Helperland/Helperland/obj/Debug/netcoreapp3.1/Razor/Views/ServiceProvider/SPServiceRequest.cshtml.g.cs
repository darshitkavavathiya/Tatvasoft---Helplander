#pragma checksum "E:\dsdasd\Tatvasoft\Helperland\Helperland\Views\ServiceProvider\SPServiceRequest.cshtml" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "52be7ccea25065cfbb26ba77d18e5f6209f1b7bb"
// <auto-generated/>
#pragma warning disable 1591
[assembly: global::Microsoft.AspNetCore.Razor.Hosting.RazorCompiledItemAttribute(typeof(AspNetCore.Views_ServiceProvider_SPServiceRequest), @"mvc.1.0.view", @"/Views/ServiceProvider/SPServiceRequest.cshtml")]
namespace AspNetCore
{
    #line hidden
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Mvc.Rendering;
    using Microsoft.AspNetCore.Mvc.ViewFeatures;
#nullable restore
#line 1 "E:\dsdasd\Tatvasoft\Helperland\Helperland\Views\_ViewImports.cshtml"
using Helperland;

#line default
#line hidden
#nullable disable
#nullable restore
#line 2 "E:\dsdasd\Tatvasoft\Helperland\Helperland\Views\_ViewImports.cshtml"
using Helperland.Models;

#line default
#line hidden
#nullable disable
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"52be7ccea25065cfbb26ba77d18e5f6209f1b7bb", @"/Views/ServiceProvider/SPServiceRequest.cshtml")]
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"b5f94cf04a7ec23f27ac33992ef127038e0b3154", @"/Views/_ViewImports.cshtml")]
    public class Views_ServiceProvider_SPServiceRequest : global::Microsoft.AspNetCore.Mvc.Razor.RazorPage<dynamic>
    {
        private static readonly global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute __tagHelperAttribute_0 = new global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute("rel", new global::Microsoft.AspNetCore.Html.HtmlString("stylesheet"), global::Microsoft.AspNetCore.Razor.TagHelpers.HtmlAttributeValueStyle.DoubleQuotes);
        private static readonly global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute __tagHelperAttribute_1 = new global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute("href", new global::Microsoft.AspNetCore.Html.HtmlString("~/css/ServiceProvider.css"), global::Microsoft.AspNetCore.Razor.TagHelpers.HtmlAttributeValueStyle.DoubleQuotes);
        private static readonly global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute __tagHelperAttribute_2 = new global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute("src", new global::Microsoft.AspNetCore.Html.HtmlString("~/js/serviceProvider.js"), global::Microsoft.AspNetCore.Razor.TagHelpers.HtmlAttributeValueStyle.DoubleQuotes);
        #line hidden
        #pragma warning disable 0649
        private global::Microsoft.AspNetCore.Razor.Runtime.TagHelpers.TagHelperExecutionContext __tagHelperExecutionContext;
        #pragma warning restore 0649
        private global::Microsoft.AspNetCore.Razor.Runtime.TagHelpers.TagHelperRunner __tagHelperRunner = new global::Microsoft.AspNetCore.Razor.Runtime.TagHelpers.TagHelperRunner();
        #pragma warning disable 0169
        private string __tagHelperStringValueBuffer;
        #pragma warning restore 0169
        private global::Microsoft.AspNetCore.Razor.Runtime.TagHelpers.TagHelperScopeManager __backed__tagHelperScopeManager = null;
        private global::Microsoft.AspNetCore.Razor.Runtime.TagHelpers.TagHelperScopeManager __tagHelperScopeManager
        {
            get
            {
                if (__backed__tagHelperScopeManager == null)
                {
                    __backed__tagHelperScopeManager = new global::Microsoft.AspNetCore.Razor.Runtime.TagHelpers.TagHelperScopeManager(StartTagHelperWritingScope, EndTagHelperWritingScope);
                }
                return __backed__tagHelperScopeManager;
            }
        }
        private global::Microsoft.AspNetCore.Mvc.Razor.TagHelpers.UrlResolutionTagHelper __Microsoft_AspNetCore_Mvc_Razor_TagHelpers_UrlResolutionTagHelper;
        #pragma warning disable 1998
        public async override global::System.Threading.Tasks.Task ExecuteAsync()
        {
#nullable restore
#line 1 "E:\dsdasd\Tatvasoft\Helperland\Helperland\Views\ServiceProvider\SPServiceRequest.cshtml"
  

#line default
#line hidden
#nullable disable
            WriteLiteral("\r\r\r");
            DefineSection("Css", async() => {
                WriteLiteral("\r");
                __tagHelperExecutionContext = __tagHelperScopeManager.Begin("link", global::Microsoft.AspNetCore.Razor.TagHelpers.TagMode.StartTagOnly, "52be7ccea25065cfbb26ba77d18e5f6209f1b7bb4586", async() => {
                }
                );
                __Microsoft_AspNetCore_Mvc_Razor_TagHelpers_UrlResolutionTagHelper = CreateTagHelper<global::Microsoft.AspNetCore.Mvc.Razor.TagHelpers.UrlResolutionTagHelper>();
                __tagHelperExecutionContext.Add(__Microsoft_AspNetCore_Mvc_Razor_TagHelpers_UrlResolutionTagHelper);
                __tagHelperExecutionContext.AddHtmlAttribute(__tagHelperAttribute_0);
                __tagHelperExecutionContext.AddHtmlAttribute(__tagHelperAttribute_1);
                await __tagHelperRunner.RunAsync(__tagHelperExecutionContext);
                if (!__tagHelperExecutionContext.Output.IsContentModified)
                {
                    await __tagHelperExecutionContext.SetOutputContentAsync();
                }
                Write(__tagHelperExecutionContext.Output);
                __tagHelperExecutionContext = __tagHelperScopeManager.End();
                WriteLiteral("\r<link rel=\"stylesheet\" href=\"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css\">\r ");
            }
            );
            WriteLiteral("\r\r\r\r\r<h1>Welcome <span> ");
#nullable restore
#line 18 "E:\dsdasd\Tatvasoft\Helperland\Helperland\Views\ServiceProvider\SPServiceRequest.cshtml"
              Write(ViewBag.Name);

#line default
#line hidden
#nullable disable
            WriteLiteral(@" </span></h1>
            WriteLiteral("ss=\"tablinks\" onclick=\"Sp_TabNav(event, \'SPSettings\')\" id=\"SettingsTabBtn\">Settings</button>\r\r\t</div>\r\r\r\t<!-- table -->\r\t");
#nullable restore
#line 46 "E:\dsdasd\Tatvasoft\Helperland\Helperland\Views\ServiceProvider\SPServiceRequest.cshtml"
Write(await Html.PartialAsync("SpUpcomingService"));

#line default
#line hidden
#nullable disable
            WriteLiteral("\r\t");
#nullable restore
#line 47 "E:\dsdasd\Tatvasoft\Helperland\Helperland\Views\ServiceProvider\SPServiceRequest.cshtml"
Write(await Html.PartialAsync("SpServiceHistory"));

#line default
#line hidden
#nullable disable
            WriteLiteral("\r\t");
#nullable restore
#line 48 "E:\dsdasd\Tatvasoft\Helperland\Helperland\Views\ServiceProvider\SPServiceRequest.cshtml"
Write(await Html.PartialAsync("SpNewServiceRequest"));

#line default
#line hidden
#nullable disable
            WriteLiteral("\r\t");
#nullable restore
#line 49 "E:\dsdasd\Tatvasoft\Helperland\Helperland\Views\ServiceProvider\SPServiceRequest.cshtml"
Write(await Html.PartialAsync("SpMyRating"));

#line default
#line hidden
#nullable disable
            WriteLiteral("\r\t");
#nullable restore
#line 50 "E:\dsdasd\Tatvasoft\Helperland\Helperland\Views\ServiceProvider\SPServiceRequest.cshtml"
Write(await Html.PartialAsync("SpBlockCustomer"));

#line default
#line hidden
#nullable disable
            WriteLiteral("\r\t");
#nullable restore
#line 51 "E:\dsdasd\Tatvasoft\Helperland\Helperland\Views\ServiceProvider\SPServiceRequest.cshtml"
Write(await Html.PartialAsync("SpSettings"));

#line default
#line hidden
#nullable disable
            WriteLiteral(@"
            __tagHelperExecutionContext = __tagHelperScopeManager.Begin("script", global::Microsoft.AspNetCore.Razor.TagHelpers.TagMode.StartTagAndEndTag, "52be7ccea25065cfbb26ba77d18e5f6209f1b7bb9634", async() => {
            }
            );
            __Microsoft_AspNetCore_Mvc_Razor_TagHelpers_UrlResolutionTagHelper = CreateTagHelper<global::Microsoft.AspNetCore.Mvc.Razor.TagHelpers.UrlResolutionTagHelper>();
            __tagHelperExecutionContext.Add(__Microsoft_AspNetCore_Mvc_Razor_TagHelpers_UrlResolutionTagHelper);
            __tagHelperExecutionContext.AddHtmlAttribute(__tagHelperAttribute_2);
            await __tagHelperRunner.RunAsync(__tagHelperExecutionContext);
            if (!__tagHelperExecutionContext.Output.IsContentModified)
            {
                await __tagHelperExecutionContext.SetOutputContentAsync();
            }
            Write(__tagHelperExecutionContext.Output);
            __tagHelperExecutionContext = __tagHelperScopeManager.End();
            WriteLiteral("\r");
        }
        #pragma warning restore 1998
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.ViewFeatures.IModelExpressionProvider ModelExpressionProvider { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.IUrlHelper Url { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.IViewComponentHelper Component { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.Rendering.IJsonHelper Json { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.Rendering.IHtmlHelper<dynamic> Html { get; private set; }
    }
}
#pragma warning restore 1591