import { Injectable } from "@angular/core";
import { Subject } from 'rxjs';
import { Post } from "./post.model";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators"
import { Router } from "@angular/router";

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private httpClient: HttpClient, private router: Router) { }
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

  getPost = (id: string) => {
    return this.httpClient.get<{ _id: string, title: string, content: string }>(`http://localhost:3000/api/posts/${id}`)
  }

  updatePost(id: string, title: string, content: string) {
    const post: Post = { id, title, content };
    this.httpClient.put(`http://localhost:3000/api/posts/${id}`, post)
      .subscribe((response) => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id)
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts
        this.postsUpdated.next([...this.posts])
        this.router.navigate(["/"]);
      })
  }

  addPost(title: string, content: string) {
    const post: Post = { id: 'null', title, content }
    this.httpClient.post<{ message: string, postId: string }>("http://localhost:3000/api/posts", post)
      .subscribe((responseData) => {
        post.id = responseData.postId
        this.posts.push(post);
        this.postsUpdated.next([...this.posts])
        this.router.navigate(["/"]);
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
