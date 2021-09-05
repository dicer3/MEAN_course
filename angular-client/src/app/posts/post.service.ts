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
              id: post._id,
              imagePath: post.imagePath
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
    return this.httpClient.get<{ _id: string, title: string, content: string, imagePath: string }>(`http://localhost:3000/api/posts/${id}`)
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof image === "object") {
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);
    } else {
      console.log("image ", image)
      postData = {
        id,
        title,
        content,
        imagePath: image
      }
    }
    this.httpClient.put(`http://localhost:3000/api/posts/${id}`, postData)
      .subscribe((response) => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === id)
        const post: Post = {
          id,
          title,
          content,
          imagePath: "response.imagePath"
        }
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts
        this.postsUpdated.next([...this.posts])
        this.router.navigate(["/"]);
      })
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);
    this.httpClient.post<{ message: string, post: Post }>("http://localhost:3000/api/posts"
      , postData)
      .subscribe((responseData) => {
        const post: Post = {
          id: responseData.post.id,
          title,
          content,
          imagePath: responseData.post.imagePath
        }
        console.log("response data...", responseData)
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
