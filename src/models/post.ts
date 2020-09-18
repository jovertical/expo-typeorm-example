import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm/browser'

@Entity('post')
export class Post {
  @PrimaryGeneratedColumn()
  id!: number

  @Column('text')
  body!: string
}
