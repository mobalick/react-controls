import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as classname from 'classnames' 

import {UpGrid, UpRow, UpCol} from '../../Containers/Grid'
import UpSelect, {UpSelectOption} from '../../Inputs/Select'

import {style} from "typestyle"

export interface UpPaginationState {
    page:number; // Donnée calculée à partir de Skip et Take mais conservé dans l'état
    skip:number; // Nombre d'élément à retirer
    take:number; // Nombre d'élément à prendre
}

export interface UpPaginationProps {
    total:number;
    defaultSkip?:number;
    defaultTake?:number;
    defaultPage?:number;
    noResultMessage?:string;
    nbByPageMessage?:string;
    takes?: Array<UpSelectOption>; // Les valeurs possibles de take
    isTakeChangeEnable?:boolean; // Activer ou non le composant de modification du nombre d'éléments à afficher par page
    isExtraInfoDisplay?:boolean; // Afficher ou non les informations indiquant le positionnement dans les éléments paginés
    onPageChange: (page:number, take:number, skip:number) => void;
}

const paginationStyle = style({
    margin: "0px 4px",
    listStyle: "none",
    display:"inline-block",
    paddingLeft:"0",
    borderRadius: "4px",
}) ;

const firstChild = { 
    marginLeft: 0,
    borderTopLeftRadius: "4px",
    borderBottomLeftRadius: "4px"
};
const lastChild = { 
    borderTopRightRadius: "4px",
    borderBottomRightRadius: "4px"
};
const itemHover = {
    zIndex: 3,
    color: "#23527C",
    backgroundColor: "#eee",
    borderColor: "#ddd"
};
const itemActive = {
    zIndex: 2,
    color: "#fff",
    backgroundColor: "#337ab7",
    borderColor: "#337ab7",
    cursor: "not-allowed"
};
const itemDisabled = {
    color: "#777",
    cursor: "not-allowed",
    backgroundColor: "#fff",
    borderColor: "#ddd"
};

const paginationItemStyle = style({
    display: "inline",
    $nest: {
        '> a' : {
            position: "relative",
            float: "left",
            padding: "6px 12px",
            marginLeft: "-1px",
            lineHeight: "1.43",
            color: "#337ab7",            
            textDecoration: "none",
            backgroundColor: "#fff",
            border: "1px solid #ddd"
        },
        "&:first-child a" : firstChild,
        "&:first-child span" : firstChild,
        "&:last-child a" : lastChild,
        "&:last-child span" : lastChild,
        'a:hover': itemHover, 
        'a:focus': itemHover,
        'span:hover': itemHover, 
        'span:focus' : itemHover,
        "&.active > a":itemActive , 
        "&.active > span":itemActive, 
        "&.active > a:hover":itemActive, 
        "&.active > span:hover":itemActive, 
        "&.active > a:focus":itemActive,  
        "&.active > span:focus":itemActive,
        "&.disabled > a" :itemDisabled,
        "&.disabled > span":itemDisabled, 
        "&.disabled > a:hover":itemDisabled, 
        "&.disabled > span:hover":itemDisabled, 
        "&.disabled > a:focus":itemDisabled,  
        "&.disabled > span:focus": itemDisabled
    }
}) ;

const paginationCounterStyle = style({
    margin: "0px 0px",
    color: "#2a6496",
    backgroundColor: "#eee",
    borderColor: "#ddd",
    borderRadius: "4px",
    padding: "6px 12px",
    lineHeight: "1.43",
    textDecoration: "none",
    border: "1px solid #ddd",
    float: "right",
    cursor: "pointer",
}) ;

export default class UpPagination extends React.Component<UpPaginationProps, UpPaginationState> {

    static defaultProps:UpPaginationProps = {
        noResultMessage: "Aucun résultat",
        nbByPageMessage: "Nbre par page",
        isTakeChangeEnable:true,
        isExtraInfoDisplay:true,
        takes:[ {id:20, text: "20"},
                {id:50, text: "50"}, 
                {id:100, text: "100"}, 
                {id:200, text: "200"}],
        total:0,
        defaultPage:1,
        defaultSkip:0,
        defaultTake:50,
        onPageChange : (page:number,take:number, skip:number) => {}
    }

    constructor(props, context) {
        super(props);
        this.state = {
            page:this.props.defaultPage,
            skip:this.props.defaultSkip,
            take:this.props.defaultTake
        }
    }

    goToPreviousPage = () => {
        if(this.state.page > 1 ) {
            var previousPage = this.state.page-1 ;
            var newState = {page:previousPage, skip: (previousPage-1)*this.state.take} ;
            this.setState(newState); 
            this.props.onPageChange(newState.page, this.state.take, newState.skip ) ;
        }
    }

    getMaxPage = () => {
        let maxPage = Math.ceil(this.props.total / this.state.take) ;
        return maxPage ;
    }

    goToNextPage = () => {
        if(this.state.page < this.getMaxPage() ) {
            var nextPage = this.state.page+1 ;
            var newState = {page:nextPage, skip: (nextPage-1)*this.state.take} ;
            this.setState(newState); 
            this.props.onPageChange(newState.page, this.state.take, newState.skip ) ;
        }
    }

    goTo = (page:number) => {
        var newState = {page:page, skip: (page-1)*this.state.take} ;
        this.setState(newState);    
        this.props.onPageChange(newState.page, this.state.take, newState.skip) ;
    }

    onTakeChange = (data: any) => {
        if(data && data.id != this.state.take) {
            var newTake =  data.id ;
            var newSkip = (this.state.page-1) * newTake;
            var newPage = (newSkip/newTake) + 1 ;
            if(newPage > Math.ceil(this.props.total / newTake)) {
                newPage = Math.ceil(this.props.total / newTake) ;
                newSkip = (newPage-1) * newTake;
            }
            var newState = {take: data.id, skip:newSkip, page: newPage } ;
            this.setState(newState) ;
            this.props.onPageChange(newState.page, newState.take, newState.skip ) ;
        }
    }

    render() {
        let pages = [] ;
        let currentPage = 1 ;
        let maxPage = this.getMaxPage() ;
        while(currentPage <= maxPage) {
            pages.push(currentPage++) ;
        }
        let from = this.state.skip + 1 ;
        let to = from + this.state.take - 1 ;
        if(to > this.props.total) 
            to = this.props.total ;

        return (
            <UpGrid>
                <UpRow>
                    <UpCol span={12}>
                        <nav>
                            <ul className={paginationStyle}>
                                <li className={classname(this.state.page==1?"disabled":"", paginationItemStyle)} onClick={this.goToPreviousPage}>
                                    <a href="#" aria-label="Previous">
                                        <span aria-hidden="true">&laquo;</span>
                                    </a>
                                </li>
                                {pages.map((value,index) => {
                                    return <li className={classname(this.state.page==value?"active":"", paginationItemStyle)} onClick={this.goTo.bind(this, value)}>
                                        <a href="#">{value}</a>
                                    </li>
                                })}
                                <li className={classname(this.state.page==maxPage?"disabled":"", paginationItemStyle)} onClick={this.goToNextPage}>
                                    <a href="#" aria-label="Next">
                                        <span aria-hidden="true">&raquo;</span>
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </UpCol>
                    <UpCol span={4}>
                        <UpSelect placeholder={this.props.nbByPageMessage} width={"small"} default={{id : this.props.defaultTake, text:this.props.defaultTake}} data={this.props.takes} onChange={this.onTakeChange} />  
                    </UpCol>
                    <UpCol span={6}>
                        <span className={paginationCounterStyle}>
                            {maxPage == 0 && 
                                <span>{this.props.noResultMessage}</span>
                            }
                            {maxPage != 0 &&
                                <span>
                                    <span>R&eacute;sultat(s)&nbsp;</span>
                                    <span>{from}</span>
                                    <span> &agrave; </span>
                                    <span>{to}</span>
                                    <span> sur </span>
                                    <span>{this.props.total}</span>
                                </span>
                            }
                        </span>
                    </UpCol>
                </UpRow>
            </UpGrid>
        )
    }
}