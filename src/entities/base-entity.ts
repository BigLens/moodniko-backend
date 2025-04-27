import { Entity, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class BaseEntity{
    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}