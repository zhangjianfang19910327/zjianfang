import {Entity, Column, PrimaryGeneratedColumn,CreateDateColumn,UpdateDateColumn} from "typeorm";
import "reflect-metadata";
@Entity()
export  class Article {

    @PrimaryGeneratedColumn()
    id: number;
    @Column({})
    title: string;//文章title

    @Column({})
    username: string;//文章作者

    @Column({nullable:true,default:""})
    type: string;//文章；类型

    @Column({nullable:true,default:""})
    topic: string;//主题

    @Column({type:"mediumtext"})
    conetent: string;//内容
 
    @CreateDateColumn()
    createdDate: Date;//创建时间

    @UpdateDateColumn()
    updatedDate: Date;//更新时间
    
}