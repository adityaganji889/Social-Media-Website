"use client";
import { UserType } from "@/interfaces/UserType";
import { searchUsers } from "@/server-actions/users";
import { Button, Input, Radio, message } from "antd";
import React, { useEffect, useState } from "react";
import UsersSearchResult from "./_components/UsersSearchResult";
import PostsSearchResult from "./_components/PostsSearchResult";
import { searchPosts } from "@/server-actions/posts";

function SearchPage() {
  const [searchFor, setSearchFor] = useState<"users" | "posts">("users");
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const searchHandler = async () => {
    try {
      setLoading(true);
      let response: any = null;
      if (searchFor === "users") {
        response = await searchUsers(searchValue);
      } else {
        response = await searchPosts(searchValue);
      }
      if (response.success) {
        if (searchFor === "users") {
          setUsers(response.data);
        } else {
          setPosts(response.data);
        }
      } else {
        message.error(response.message);
      }
    } catch (error: any) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {}, [searchValue]);
  return (
    <div>
      <h1 className="text-2xl font-bold text-primary">
        Search Users, Posts, Hashtags
      </h1>
      <div className="flex gap-5">
        <Input
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
            if (e.target.value == "") {
              setUsers([]);
            }
          }}
          placeholder="Search Users, Posts, Hashtags..."
        />
        <Button type="primary" loading={loading} onClick={searchHandler}>
          Search
        </Button>
      </div>
      <div className="mt-5 flex gap-5 items-center">
        <span>Search For</span>
        <Radio.Group
          onChange={(e) => setSearchFor(e.target.value)}
          value={searchFor}
        >
          <Radio value="users">Users</Radio>
          <Radio value="posts">Posts</Radio>
        </Radio.Group>
      </div>

      {searchFor === "users" ? (
        <UsersSearchResult users={users} />
      ) : (
        <PostsSearchResult posts={posts} />
      )}
    </div>
  );
}

export default SearchPage;
