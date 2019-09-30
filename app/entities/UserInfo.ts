import {Entity, Column, PrimaryGeneratedColumn,Generated,CreateDateColumn,UpdateDateColumn} from "typeorm";
import "reflect-metadata";
@Entity()
export  class UserInfo {

    @PrimaryGeneratedColumn()
    id: number;//自增id

    @Column({})
    username: string;//登录用户名

    @Column({nullable:true,default:""})
    description: string;//个人描述

    @Column()
    password: string;//登录密码

    @Column({nullable:true,default:""})
    phonenumber: string;//手机号

    @Column({nullable:true,default:""})
    email: string;//电子邮箱

    @Column({nullable:true,default:""})
    role: string;//角色  管理员还是 普通

    @Column({nullable:true,default:""})
    figureurl: string;//头像

    @Column({nullable:true,default:""})
    city: string;//所在城市

    @Column({nullable:true,default:""})
    province: string;//所在的省份

    @Column({nullable:true,default:""})
    gender: string;//性别

    @Column({nullable:true,default:""})
    nickname:string;//qq昵称

    @Column({nullable:true,default:""})
    openid:string;

    @Column({nullable:true,default:""})
    @Generated("uuid")
    uuid: string;//uuid  唯一

    @CreateDateColumn()
    createdDate: Date;//创建时间

    @UpdateDateColumn()
    updatedDate: Date;//更新时间


}