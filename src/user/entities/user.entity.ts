import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from 'bcrypt'


@Entity('user')
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: number

    @Column({
        type: 'varchar',
        nullable: false,
        unique: false
    })
    fullName: string;

    @Column({
        type: 'varchar',
        nullable: false,
        unique: false
    })
    email: string;

    @Column({
        type: 'varchar',
        nullable: false,
        unique: true
    })
    username: string;

    @Column({
        type: 'varchar',
        nullable: false,
        unique: false
    })
    password: string;

    @BeforeInsert()  async hashPassword() {
        this.password = await bcrypt.hash(this.password, 13);
    } 
}
