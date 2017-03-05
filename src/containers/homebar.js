const React =require('react');
const PT=React.PropTypes;
const E=React.createElement;
const SearchBox=require("./searchbox");
const SearchOptions=require("./searchoptions");
const ModeSelector=require("./modeselector");
const {selectDB}=require("../model/mode");

class HomeBar extends React.Component {
	render(){
		const title=this.props.cor.meta.title;
		return E("div",{className:"homebar homebarbox"}
			,"　"
			,E("span",{onClick:selectDB,className:"activedb"},title)
			,"　"
			,E(SearchBox,this.props)
			,"　"
			,E(ModeSelector,this.props)
			//,E(SearchOptions,this.props)
		)
	}
};
module.exports=HomeBar;