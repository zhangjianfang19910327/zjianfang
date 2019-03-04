import {Entity, Column, PrimaryGeneratedColumn} from "typeorm";
import "reflect-metadata";
@Entity()
export  class UserInfo {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    description: string;

    @Column()
    password: string;

    @Column()
    phonenumber: number;

    @Column()
    email: string;
}