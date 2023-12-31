import { BlogEntry } from "../../model/BlogEntryModel.tsx";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import React, { useEffect, useState } from "react";
import AppHeader from "../../components/AppHeader.tsx";
import styled from "styled-components";
import MinusSvg from "../../assets/minus-circle.svg";
import PlusSvg from "../../assets/plus-circle.svg";

const EditForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0.6em;
  gap: 0.6em;
`;

const TitleInput = styled.input`
  font-size: 1.4em;
  border-radius: 8px;
  border: 0.22em #3E608C solid;
  padding: 0.4em;
  font-weight: 500;
  background-color: rgb(166, 115, 96);
  cursor: text;
  transition: border-color 0.25s;
  position: relative;
`;

const ContentTextarea = styled.textarea`
  font-size: 1.2em;
  border-radius: 8px;
  border: 0.22em #3E608C solid;
  padding: 0.7em;
  font-weight: 500;
  background-color: rgb(157, 133, 118);
  cursor: text;
  transition: border-color 0.25s;
  position: relative;
`;

const TagsTitle = styled.span`
  font-size: 1.2em;
  padding: 0.2em;
`;

const TagContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4em;
  padding: 0.1em;
`;

const SingleTag = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-content: center;
  gap: 0.4em;
`;

const TagLabel = styled.label`
  font-size: 1.2em;
  width: 2em;
  text-align: end;
  align-self: center;
`;

const TagInput = styled.input`
  font-size: 1.2em;
  padding: 0.2em;
`;

const TagButton = styled.button`
  width: 3em;
  height: 3em;
  font-size: 1em;
  position: relative;
  background: none;
  border: none;
`;

const ButtonImage = styled.img`
  width: 2.4em;
  position: absolute;
  top: 0.2em;
  left: 0;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 0.6em;
  justify-content: stretch;
`;

const Button = styled.button`
  border-radius: 10px;
  padding: 0.6em;
  background-color: #3E608C;
  border: none;
  cursor: pointer;
  width: 100%;
  font-size: 1.2em;
`;

export default function EditBlogentry() {
    const navigateTo = useNavigate();
    const { id } = useParams();
    const [blogentry, setBlogentry] = useState<BlogEntry>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await axios(`/api/blogs/${id}`);
                setBlogentry(response.data);
                setLoading(false);
            } catch (err) {
                setError(true);
                setLoading(false);
            }
        };
        fetchBlog().then();
    }, [id]);

    const deleteTag = (index: number) => {
        if (blogentry && blogentry.hashtags) {
            const newTags = [...blogentry.hashtags];
            newTags.splice(index, 1);
            setBlogentry({ ...blogentry, hashtags: newTags });
        }
    };

    const insertTag = (index: number) => {
        if (blogentry && blogentry.hashtags) {
            const newTags = [...blogentry.hashtags];
            newTags.splice(index + 1, 0, "");
            setBlogentry({ ...blogentry, hashtags: newTags });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (blogentry) {
            const mytags = blogentry.hashtags.filter((tag) => tag !== "");
            const date = blogentry.timeCreated
                ? new Date(blogentry.timeCreated)
                : new Date();
            const formattedDate = date.toISOString();

            const changedBlogEntry: BlogEntry = {
                id: blogentry.id,
                title: blogentry.title,
                content: blogentry.content,
                hashtags: mytags,
                timeCreated: formattedDate,
                author: blogentry.author,
            };

            try {
                await axios.put("/api/blogs/" + id, changedBlogEntry);
                navigateTo("/");
            } catch (err) {
                setError(true);
            }
        }
    };

    if (loading) return <div>Loading...</div>;

    if (error) return <div>Something went wrong</div>;

    return (
        <>
            <AppHeader headerText={"Edit Blog"} />
            <EditForm onSubmit={handleSubmit}>
                {blogentry && (
                    <>
                        <TitleInput
                            type="text"
                            value={blogentry.title || ""}
                            onChange={(e) => {
                                setBlogentry({ ...blogentry, title: e.target.value });
                            }}
                        />
                        <ContentTextarea
                            rows={23}
                            value={blogentry.content}
                            onChange={(e) => {
                                setBlogentry({ ...blogentry, content: e.target.value });
                            }}
                        />
                        <TagsTitle>Tags:</TagsTitle>
                        <TagContainer>
                            {blogentry.hashtags &&
                                blogentry.hashtags.map((tag, index) => (
                                    <SingleTag key={index}>
                                        <TagLabel htmlFor={"tag" + (index + 1)}>{index + 1}. </TagLabel>
                                        <TagInput
                                            maxLength={20}
                                            type="text"
                                            id={"tag" + (index + 1)}
                                            value={tag}
                                            onChange={(event) => {
                                                const newTags = [...blogentry.hashtags];
                                                newTags[index] = event.target.value;
                                                setBlogentry({ ...blogentry, hashtags: newTags });
                                            }}
                                        />
                                        <TagButton type={"button"} onClick={() => deleteTag(index)}>
                                            <ButtonImage src={MinusSvg} alt="Reduce Icon" />
                                        </TagButton>
                                        <TagButton type={"button"} onClick={() => insertTag(index)}>
                                            <ButtonImage src={PlusSvg} alt="Add Icon" />
                                        </TagButton>
                                    </SingleTag>
                                ))}
                        </TagContainer>
                    </>
                )}
                <ButtonContainer>
                    <Button type="button" onClick={() => navigateTo("/")}>
                        Discard
                    </Button>
                    <Button type="submit">Save</Button>
                </ButtonContainer>
            </EditForm>
        </>
    );
}
