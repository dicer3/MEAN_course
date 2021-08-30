import { Injectable } from "@angular/core";
import { Subject } from 'rxjs';
import { Post } from "./post.model";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators"

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private httpClient: HttpClient) { }
  getPosts() {
    this.httpClient.get<{ message: string, posts: Post[] }>('http://localhost:3000/api/posts')
      .pipe(
        map((postData: any) => {
          console.log("postDta..", postData)
          return postData.posts.map((post: any) => {
            return {
              title: post.title,
              content: post.content,
              id: post._id
            }
          })
        })
      )
      .subscribe((postData) => {
        this.posts = postData;
        this.postsUpdated.next([...this.posts])
      });

  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = { id: 'null', title, content }
    this.httpClient.post<{ message: string, postId: string }>("http://localhost:3000/api/posts", post)
      .subscribe((responseData) => {
        post.id = responseData.postId
        this.posts.push(post);
        this.postsUpdated.next([...this.posts])
      })

  }

  deletePost(postId: string) {
    console.log("in delete post ", postId)
    this.httpClient.delete("http://localhost:3000/api/posts/" + postId)
      .subscribe((responseData) => {
        console.log("message...", responseData)
        const updatedPosts = this.posts.filter(post => post.id !== postId)
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts])
      })
  }
}
