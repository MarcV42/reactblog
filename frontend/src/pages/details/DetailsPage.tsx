import AppHeader from "../../components/AppHeader.tsx";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { BlogEntry } from "../../model/BlogEntryModel.tsx";
import axios from "axios";
import BookmarkSvg from "../../assets/bookmark.svg";
import TrashSvg from "../../assets/trash.svg";
import PencilSvg from "../../assets/pencil.svg";
import BackSvg from "../../assets/arrow-uturn-left.svg";
import styled from "styled-components";

const ReturnButton = styled.button`
  border-radius: 10px;
  position: relative;
  align-self: end;
  padding: 0;
  border: none;
  cursor: pointer;
`;

const ReturnButtonImage = styled.img`
  position: absolute;
  left: 1.2em;
  top: -5em;
  width: 2.6em;
`;

const Container = styled.div`
  border: 0.37em #F288A4 solid;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-content: center;
  padding: 1em;
  position: relative;
  gap: 0.4em;
  margin: -0.8em 0.4em 0.4em;
  overflow: hidden;
`;

const Heading = styled.h2`
  font-size: 1.6em;
  align-self: center;
  color: #f7c297;
`;

const EntryDate = styled.small`
  align-self: flex-start;
  position: absolute;
  bottom: 0.4em;
  right: 0.4em;
  font-size: 0.9em;
  color: #90d2d8;
  
`;

const BookmarkButton = styled.button`
  width: 3em;
  border-radius: 10px;
  position: absolute;
  top: -1.2em;
  right: 0.2em;
  align-self: end;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.5em;
  
`;

const Button = styled.button`
  border-radius: 10px;
  position: relative;
  align-self: end;
  padding: 0;
  background-color: #90d2d8;
  border: none;
  cursor: pointer;
  width: 100%;
  height: 3em;
  font-size: 1.2em;
`;

const ButtonImage = styled.img`
  position: absolute;
  left: 0.7em;
  top: 0.8em;
  width: 1.4em;
`;

const BlogContent = styled.p`
  font-size: 1.2em;
  white-space: pre-wrap;
  word-break: break-word;
`;

const TagList = styled.ul`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  gap: 0.4em;
  list-style: none;
  font-size: 0.9em;
`;

const Tag = styled.li`
  padding: 0.3em;
`;

export default function DetailsPage() {
    const { id } = useParams();
    const [blogEntry, setBlogEntry] = useState<BlogEntry>({} as BlogEntry);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    const navigateTo = useNavigate();

    const BlogTitle = blogEntry.title;
    const BlogTimeCreated = blogEntry.timeCreated;

    const date: string = new Date(BlogTimeCreated).toLocaleDateString();
    const timeOptions: Intl.DateTimeFormatOptions = {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZoneName: "short",
        timeZone: "UTC",
    };
    const time: string = new Date(BlogTimeCreated).toLocaleTimeString(
        undefined,
        timeOptions
    );

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await axios(`/api/blogs/${id}`);
                setBlogEntry(response.data);
                setLoading(false);
            } catch (error) {
                setError(true);
                setLoading(false);
            }
        };
        fetchBlog().then();
    }, [id]);

    function handleDeleteEntry(id: string) {
        // Bestätigungspopup
        if (window.confirm("Are you sure you want to delete this blog entry?")) {
            axios
                .delete("/api/blogs/" + id)
                .then(() => {
                    navigateTo("/");
                })
                .catch((error) => {
                    const errorMessage = "Error while deleting: " + error.message;
                    window.alert(errorMessage); // Shows Popup
                });
        }
    }


    function handleEditEntry() {
        navigateTo("/edit-entry/" + id);
    }

    function handleClickBookmark() {
        alert("Bookmark was clicked.");
    }

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Something went wrong</div>;
    return (
        <>
            <AppHeader headerText="Blog Entry" />
            <ReturnButton type="button" onClick={() => navigateTo(-1)}>
                <ReturnButtonImage src={BackSvg} alt="Go back arrow icon" />
            </ReturnButton>
            <Container>
                <Heading>{BlogTitle}</Heading>
                <EntryDate>{date + " " + time}</EntryDate>
                <BookmarkButton type="button" onClick={handleClickBookmark}>
                    <img src={BookmarkSvg} alt="Bookmark" />
                </BookmarkButton>
                <BlogContent>{blogEntry.content}</BlogContent>
                <ButtonContainer>
                    <Button type="button" onClick={() => handleDeleteEntry(id ? id : "")}>
                        <ButtonImage src={TrashSvg} alt="Trash Icon" />
                        Delete
                    </Button>
                    <Button type="button" onClick={handleEditEntry}>
                        <ButtonImage src={PencilSvg} alt="Pencil Icon" />
                        Edit
                    </Button>
                </ButtonContainer>
                <TagList>
                    {blogEntry?.hashtags.map((hashtag, index) => (
                        <Tag key={index}>{hashtag}</Tag>
                    ))}
                </TagList>
            </Container>
        </>
    );
}
