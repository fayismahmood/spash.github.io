const routs=[]

class HashSpa{
    constructor(url,page,dom){
        this.url=url
        this.page=page
        this.dom=dom

        this.pushIntoRouts(this)  
    }

    pushIntoRouts(_obj){
        if(routs.filter(e=>e.url==this.url).length>0){
            console.error(`${this.url} rout is already set`);
        }else{
            routs.push(_obj)            
            this.onPageLoad(this.url)
            
        }
    }
    onPageLoad(url){
        
        let _path=location.hash
        if(url==_path.replace(/#/g,"") || url==_path){
                this.goPageWithParent(url)
        }
        
        window.addEventListener("hashchange",()=>{
            let newPath=location.hash
            if(url==newPath.replace(/#/g,"") || url==newPath){
                console.log("wwwwwwwwwwwwwwwwww");
                this.goPage()
            }
        })

    }


    getEachUrl(_Array){
        let _eachUrl=[]
        _Array.forEach((e,i)=>{
            let __e=""
            for(let m=0;m<=i;m++){
                __e=__e+"/"+_Array[m];
            }
            __e=__e.replace("/","")
            _eachUrl.push(__e)
        })

        return _eachUrl
    }


    goPageWithParent(url){
        let _url_toArray=url.split("/")
        let _eachUrl=this.getEachUrl(_url_toArray)
        _eachUrl.forEach(each=>{
            let _obj=routs.find(e=>e.url==each);
            _obj?_obj.goPage():0;
            
        })                 
    }
    
    goPage(){
        fetch(this.page).then(e=>e.text()).then(e=>{

            
            var _dom =document.querySelector(this.dom)
            _dom.innerHTML=e

            ////runs Scripts In dom
            var _script=_dom.querySelectorAll("script")
            for(var _escript of _script){
                
                eval(_escript.innerHTML)
            }
            
            
            console.log(e);
            
            if(document.querySelector('spa-link[link="'+this.url+'"]')){
                let _this=document.querySelector('spa-link[link="'+this.url+'"]');
                let _active=document.querySelectorAll("spa-link._active")
                _active.forEach(e=>{
                    e.classList.remove("_active")
                })
                var UrlArray=this.getEachUrl(this.url.split("/"))
                for(let _each of UrlArray){
                    let _eachDom=document.querySelector('spa-link[link="'+_each+'"]');
                    _eachDom?_eachDom.classList.add("_active"):0;
                }
                
            }
        })
    }
}


class Link extends HTMLElement{
    constructor(){
        super()     
    }

    connectedCallback(){
        this.link=this.getAttribute("link")
        this._inn=this.innerHTML
        var btn=document.createElement("button")
        this.innerHTML=''
        btn.append(this._inn)
        this.append(btn)


        let newPath=location.hash
        if(this.link==newPath.replace(/#/g,"") || this.link==newPath){
            
        }

        btn.onclick=()=>{
            location.hash=this.link
            var _active=document.querySelectorAll("spa-link._active")
            _active.forEach(e=>{
                e.classList.remove("_active")
            })
            this.classList.add("_active")
        }

    }
    
}



window.customElements.define("spa-link",Link)