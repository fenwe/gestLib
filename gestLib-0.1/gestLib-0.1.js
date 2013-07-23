/*!
fichier: gesteLib-0.1.js
version:0.1
auteur:pascal TOLEDO
date: 2012.02.21
source: http://legral.fr/intersites/lib/perso/js/gestLib/gestLib-0.1/
depend de:
  * rien
description:
* Gestion des libs chargées
* Creation d'une console en lecture (div) ou editable (textarea), evaluable pour le debuggage
* L'utilisation des consoles n'est pas obligatoiresPour une console créer dynamiquement et indépendante d'une librairie regarder plutot du cote de gestConsoles-0.2.js
*/

var gestLib_date = new Date();

//options: nom:obligatoire
//erreur:
// -1: absence de nom
// -10..-11..-12: absence de div pour la console
function gestionLibrairie_lib(options)
  {
	this.erreur=0;
	if (options.nom==undefined){this.erreur=-1;}
	this.libType=(options.libType=='tiers')?'tiers':'perso';	// defaut:pas de console
	this.isConsole=(options.isConsole===1)?1:0;	// defaut:pas de console
	this.isVisible=(options.isVisible===0)?0:1;	// defaut:visible
	this.nom=(options.nom!=undefined)?options.nom:this.HTMLId;
	this.HTMLId=(options.HTMLId!=undefined)?options.HTMLId:this.nom;
	this.description=(options.description!=undefined)?options.description:'';
	this.ver=(options.ver!=undefined)?options.ver:0;
	this.url=(options.url!=undefined)?options.url:null;//site du code source
	this.deb=gestLib_date.getTime();
	this.fin=null;	this.dur=null;
	this.CSSSupId=null;	this.CSSNomId=null;	this.CSSTxtId=null;
	if (this.isConsole)	{this.setConsole();}
	if (this.erreur){return this.erreur;}
	return this;
	}

gestionLibrairie_lib.prototype=
	{
	destruct:function(){},
	end:function(){var gestLib_date = new Date();this.fin=gestLib_date.getTime();this.dur=this.fin-this.deb;}
	,setConsole:function()
		{
		this.CSSSupId=document.getElementById(this.HTMLId+'_Support');	if (this.CSSSupId==null){this.erreur=-10;}
		this.CSSNomId=document.getElementById(this.HTMLId+'_Nom');	if (this.CSSNomId==null){this.erreur=-11;}
		this.CSSTxtId=document.getElementById(this.HTMLId+'_Texte');	if (this.CSSTxtId==null){this.erreur=-12;}

		this.consoleTexte='';
	
		if (!this.erreur){this.CSSNomId.innerHTML='console:'+this.nom;}
		if (!this.isVisible){this.hide();}
		this.isConsole=1;
		}

	,valueToString:function(val)
			{
			if (val===undefined){return"'undefined'";}
			if (val===null){return"'null'";}
			return val;
			}
	,evaluer:function()
		{
		if (this.CSSTxtId)
			{switch (this.CSSTxtId.tagName.toUpperCase())
				{
				case 'TEXTAREA':eval(this.CSSTxtId.value);break;
				case 'DIV':default:eval(this.CSSTxtId.innerHTML);
				break;
				}
			}
		}
	,clear:function()
		{
		if (this.CSSTxtId)
			{
			this.consoleTexte='';
			//this.consoleTexte='console Clear<br>';
			switch (this.CSSTxtId.tagName.toUpperCase())
				{
				case 'TEXTAREA':this.CSSTxtId.value='';break;
				case 'DIV':default:this.CSSTxtId.innerHTML=this.consoleTexte;
				break;
				}
			}
		}
	,display:function(etat){if (this.CSSSupId!=null){if (etat==undefined){etat=1;};this.CSSSupId.style.display=(etat==1)?'block':'none';}}
	,switchShow:function(){if (this.CSSSupId!=null){if(this.isVisible){this.hide();}else{this.show();}}}
	,show:function(){if (this.CSSSupId!=null){this.isVisible=1;this.CSSTxtId.style.display='block';}}
	,hide:function(){if (this.CSSSupId!=null){this.isVisible=0;this.CSSTxtId.style.display='none';}}
	,write:function(txt)
		{
		switch (this.CSSTxtId.tagName.toUpperCase())
			{
			case 'TEXTAREA':
				this.consoleTexte+=txt+'\n';
				if (this.CSSTxtId){this.CSSTxtId.value=this.consoleTexte;}
				break;
			case 'DIV':default:
				this.consoleTexte+=txt+'<br>';
				if (this.CSSTxtId){this.CSSTxtId.innerHTML=this.consoleTexte;}
				break;
			}
		return 0;
		}
		
	//inspect renvoie un texte avec le nom et la valeur d'une variable DANS la console
	,inspect:function(varNom,varPtr)
		{
		var c=0;
		switch (this.CSSTxtId.tagName.toUpperCase())
			{
			case 'TEXTAREA':
				this.consoleTexte+=varNom+'='+varPtr+'\n';
				c=1;
				break;
			case 'DIV':default:
				this.consoleTexte+='<span class="gestLib_varNom">'+varNom+'</span>=<span class="gestLib_varPtr">'+varPtr+'</span><br>';
				c=1;
				break;
			}
		if((c===1)&&(this.CSSTxtId)){this.CSSTxtId.innerHTML=this.consoleTexte;}
		}
	,inspectAll:function(varNom,varPtr)
		{
		var out='INSPECT';
		if (varNom){out+='<span>'+varNom+'=</span>';}
		out+='<ul>';
		for (value in varPtr){out+='<li>'+this.inspectAll(value+'</li>');}
		out+='</ul>';
		if (varNom){out+='</span><br>';}
		this.consoleTexte+=out;
		if (this.CSSTxtId){this.CSSTxtId.innerHTML=this.consoleTexte;}
		}
	}//gestionLibrairie_lib.prototype

/* ************************************************************
// ---- gestionLibrairie ----
   ***********************************************************/
function gestionLibrairie(){this.libNb=0;this.libs=new Array();return this;}
gestionLibrairie.prototype=
	{
	destruct:function(lib)
		{
		document.write('destruct:function(lib)<br>');
		if(lib)
			{
			if(this.libs[lib])
				{
				//document.write('===>this.libs[lib]:'+this.libs[lib]+'<br>');
				//this.libs[lib].destruct();
				this.libs[lib]=undefined;
				this.libNb--;
				}
			}
		else	{
			var libNu=0;
			for(libr in this.libs)
				{
//				document.write('<b>===->this.libs[libr].nom:'+this.libs[libr].nom+'</b><br>');
//				document.write('===>this.libs[libr]:'+this.libs[libr]+'<br>');
//				document.write('=== >this.libs[libr].typeof:'+this.libs[libr].typeof+'<br>');
//				this.libs[libr].destruct();
				this.libs[libr]=undefined;
				libNu++;
				if (libNu>=this.libNb){break;}
				}
			this.libs=undefined;
			this.libNb=0;
			}
		},
	//gestion des consoles
	end:function(libNom)
		{if (libNom&&this.libs[libNom]){this.libs[libNom].end();}},
	setConsole:function(libNom)
		{if (libNom&&this.libs[libNom]){this.libs[libNom].setConsole();}},
	clear: function(libNom)
		{if (libNom&&this.libs[libNom]&&this.libs[libNom].isConsole){this.libs[libNom].clear();}},
	evaluer:function(options)
		{if(options&&this.libs[options.lib]&&this.libs[options.lib].isConsole){this.libs[options.lib].evaluer();}},

	write: function(options)
		{if (options&&this.libs[options.lib]&&this.libs[options.lib].isConsole){this.libs[options.lib].write(options.txt);}},
	inspect:function(options)
		{if(options && this.libs[options.lib]&&this.libs[options.lib].isConsole){this.libs[options.lib].inspect(options.varNom,options.varPtr);}},
	inspectAll:function(varNom,varPtr)
		{if(options && this.libs[options.lib]&&this.libs[options.lib].isConsole){this.libs[options.lib].inspectAll(options.varNom,options.varPtr);}},
	loadLib:function(options)
		{
		if (!options){return -1;}
		if (!options.nom){return -2;}
		if(this.libs[options.nom]==undefined ||options.force)
			{
			this.libs[options.nom]=new gestionLibrairie_lib(options);
			if (this.libs[options.nom]<0){return this.libs[options.nom];}
			this.libNb++;
			return 0;		
			}
		return -3;
		},
	display:function(libNom,etat){if(this.libs[libNom].isConsole){this.libs[libNom].display(etat);}},
	switchShow:function(libNom){if(this.libs[libNom].isConsole){this.libs[libNom].switchShow();}},
	show:function(libNom){if(this.libs[libNom].isConsole){this.libs[libNom].show();}},
	hide:function(libNom){if(this.libs[libNom].isConsole){this.libs[libNom].hide();}},
	tableau:function()
		{
		var out='';
		out+='<table><caption>Librairie JavaScript ('+this.libNb+')</caption>';
		out+='<thead><tr><th>type</th><th>nom</th><th>version</th><th>err</th><th>durée</th>';
		out+='<th>description</th><th>url</th>';
		out+='<th title="console demander?">console</th><th title="console visible?">visible</th><th>HTMLId</th></tr></thead>';

		for (value in this.libs)
			{if (this.libs[value].nom)
				{
				url='';
				if (this.libs[value].url!=null){url='<a href="'+this.libs[value].url+'">lien</a>';}
				out+='<tr><td>'+this.libs[value].libType+'</td><td>'+this.libs[value].nom+'</td><td>'+this.libs[value].ver+'</td><td>'+this.libs[value].erreur+'</td><td>'+this.libs[value].dur+'</td>';
				out+='<td>'+this.libs[value].description+'</td><td>'+url+'</td>';
				out+='<td>'+this.libs[value].isConsole+'</td><td>'+this.libs[value].isVisible+'</td><td>'+this.libs[value].HTMLId+'</td>';
				out+='</tr>\n';
				}
			};
		out+='</table>';
		return out;
		}
	} //class gestionLibrairie prototype



/* ************************************************************
instantiation du gestionnaire
 ***********************************************************/
gestLib=new gestionLibrairie();
gestLib.loadLib({nom:'gestLib',HTMLId:'gestLib',ver:0.1,description:'console pour la lib gestionLibrairie',isConsole:0,isVisible:0,url:'http://legral.fr/intersites/lib/perso/js/gestLib/gestLib-0.1/'});
gestLib.end('gestLib');
