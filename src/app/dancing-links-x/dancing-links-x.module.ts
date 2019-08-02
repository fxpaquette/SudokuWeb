import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as nj from '../../../bower_components/numjs/dist/numjs.min.js';

//Foncion range similaire a celle de python
const range = ( a , b ) => Array.from( new Array( b > a ? b - a : a - b ), ( x, i ) => b > a ? i + a : a - i );


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})

class OneNode{
    r:OneNode;
    l:OneNode;
    u:OneNode;
    d:OneNode;

    c:any; //ColumnNode
    row:any; //number

    constructor(columnNode = null,row = null){
        this.r =this;
        this.l =this;
        this.u =this;
        this.d =this;

        this.row = row;
        this.c = columnNode;
    }
    setRight(rightNode){
        rightNode.r = this.r
        rightNode.r.l = rightNode
        this.r = rightNode
        rightNode.l = this
        return rightNode
    }
    setDown(downNode){
        if(this.c != downNode.c)
        downNode.d = this.d
        downNode.d.u = downNode
        this.d = downNode
        downNode.u = this
        return downNode
    }
    detachLR(){
        this.l.r=this.r
        this.r.l =this.l
    }
    reattachLR(){
        this.l.r = this.r.l = this
    }
    detachUD(){
        this.u.d = this.d
        this.d.u = this.u
    }
    reattachUD(){
        this.u.d = this.d.u = this
    }
}

class ColumnNode extends OneNode{
    name:string;
    size: number;

    constructor(name){
        super();
        this.size = 0;
        this.name = name;
        this.c = this;
    }
    cover(){
        this.detachLR()
        let i = this.d
        while(i != this){
            let j = i.r
            while (j != i){
                j.detachUD()
                j.c.size-=1
                j = j.r
            }
            i = i.d
        }
    }
    
    uncover(){
        let i = this.u
        while(i != this){
            let j = i.l
            while(j != i){
                j.c.size+=1
                j.reattachUD()
                j = j.l
            }
            i = i.u
        }
        this.reattachLR()
    }
}

export class DancingLinksXModule { 
    solutions:number;
    answer:Array<any>;
    header:ColumnNode;

    constructor(matrice){
        this.solutions = 0;
        this.answer = [];
        this.header = this.makeNodes(matrice);
    }

    makeNodes(matrice){
        let nbRows = matrice.shape[0];
        let nbCols = matrice.shape[1];
        let header = new ColumnNode("header");

        let listColumnNodes = [];
        for (let i of range(0,nbCols)){
            let n = new ColumnNode(i.toString());
            listColumnNodes.push(n);
            header = header.setRight(n);
            //header sert de variable pour conserver la node precedent dans la boucle
        //Durant la boucle le r de header reste toujours le header original donc on ne le perd pas
        //On le reassigne a la fin de la boucle
        }
        header = header.r.c;
        for (let i of range(0,nbRows)){
            let prev = null;
            for (let j of range(0,nbCols)){
                if (matrice.get(i,j)==1){
                    let col = listColumnNodes[j];
                    let newNode = new OneNode(col,i);
                    if(prev == null){
                        prev = newNode;
                    }
                    col.u.setDown(newNode); //Car le u de col est le dernier element de la colonne, on met newNode a la suite de ce dernier element
                    prev = prev.setRight(newNode);
                    col.size++;
                }
            }
        }
        header.size = nbCols;
        return header;
    }

    selectColumn(){
        let min_val = 100000;
        let colonne = null;
        let c = this.header.r as ColumnNode;
        while(c!=this.header){
            if (c.size < min_val){
                min_val = c.size;
                colonne = c;
            }
            c=c.r as ColumnNode;
        }
        return colonne
    }

    search(k:number){
        if(this.header.r == this.header){
            this.solutions++;
            return;
        }else{
            let c = this.selectColumn();
            c.cover();
            let x = c.d;
            while(x!=c){
                this.answer.push(x)
                let j=x.r
                while(j!=x){
                    j.c.cover()
                    j=j.r
                }
                this.search(k+1)
                if (this.solutions >0){return;}
                x=this.answer.pop()
                
                c = x.c

                j=x.l
                while(j!=x){
                    j.c.uncover()
                    j=j.l
                }
                x=x.d
            }
            c.uncover();
        }
    }

    runDLX(){
        this.search(0);
        return this.getSolutionDefault();
    }

    getSolutionDefault(){
        let solution = []
        let rows = []
        for (let node of this.answer){
            let temp = []
            let row_temp = []
            row_temp.push(node.row)
            temp.push(node.c.name)
            let rnode = node.r
            while (rnode != node){
                temp.push(rnode.c.name)
                //row_temp.append(rnode.row)
                rnode = rnode.r
            }
            //print(temp)
            //rows.append(row_temp)
            rows.push(node.row)
            solution.push(Array.from(temp))
        }
        //print("Rows: ",rows)
        return rows
    }
}
