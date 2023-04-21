import React, { useState, useEffect } from 'react';
import Markdown from 'markdown-to-jsx';

const About = () => {
    const file_name = 'About.md';
    const [post, setPost] = useState('');

    useEffect(() => {
        import(`../markdown/${file_name}`)
            .then(res => {
                fetch(res.default)
                    .then(res => res.text())
                    .then(res => setPost(res))
                    .catch(err => console.log(err));
            })
            .catch(err => console.log(err));
    });

    return (
        <div id="markdown">
            <Markdown>
                {post}
            </Markdown>
        </div>
    );
}

export default About;
