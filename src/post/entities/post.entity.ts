import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity} from "src/user/entities/user.entity";

@Entity('post')
export class PostEntity {
    @PrimaryGeneratedColumn()
    postid: number

    @Column({
        type: 'varchar',
        length: 200,
        nullable: false,
        unique: false
    })
    text: string;

    @CreateDateColumn({
        type: 'timestamptz',
        nullable: false,
        unique: false
    })
    date: string;

    @ManyToOne(() => UserEntity, (user) => user.posts)
    author: UserEntity;
}
