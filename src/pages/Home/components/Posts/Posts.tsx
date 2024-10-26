import { avatarImg } from '@/assets/images'
import { PostProps } from '@/types/post.type'
import Post from '@/components/Post'

const content = `
<h1>heading 1</h1><h4 style="text-align: center">heading 4</h4><pre><code class="language-css">.custom-pre {
  padding: 16px;
  border-radius: 8px;
  overflow: auto;
}

.custom-line {
  display: flex;
}

.line-number {
  width: 30px;
  text-align: right;
  margin-right: 10px;
  color: #999;
}

.custom-token {
  font-family: 'Fira Code', monospaceajdfjkalsfdhjlkdsahflfhasfkjhsjkfhsjhfsfkkahsflhaslkjfhlahflahsfjklhasjkfdhlajkshdfjlkaghfkjagsfjka;
}

.custom-pre-code {
  padding: 16px;
  border-radius: 8px;
  overflow: auto;
}</code></pre>
`

const post: PostProps = {
  title: 'My First Post',
  tags: ['React', 'JavaScript', 'Web Development'],
  userName: 'John Doe',
  userAvatar: avatarImg,
  date: '2023-10-01',
  numberOfLikes: 100,
  numberOfDislikes: 10000,
  numberOfComments: 100000,
  content,
  comments: [
    {
      userName: 'Jane Smith',
      userAvatar: avatarImg,
      date: '2023-10-02',
      numberOfLikes: 10,
      numberOfDislikes: 100,
      content
    },
    {
      userName: 'Jane Smith',
      userAvatar: avatarImg,
      date: '2023-10-02',
      numberOfLikes: 10,
      numberOfDislikes: 100,
      content
    },
    {
      userName: 'Jane Smith',
      userAvatar: avatarImg,
      date: '2023-10-02',
      numberOfLikes: 10,
      numberOfDislikes: 100,
      content
    }
  ]
}

export default function Posts() {
  return (
    <div className='space-y-4'>
      {[1].map((item) => (
        <Post key={item} post={post} />
      ))}
    </div>
  )
}
