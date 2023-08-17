import { Input, Tabs, Card } from 'antd';
import React, {useEffect,useRef,useState, createContext } from 'react'
import Search from "antd/es/input/Search"
import "./index.less"
import {Divider, Tag, Button,Modal,Form,InputNumber,Rate,InputRef } from "antd"
import {ReadOutlined,DownloadOutlined,ShareAltOutlined,SaveOutlined} from "@ant-design/icons"
import { TweenOneGroup } from 'rc-tween-one'
import { PlusOutlined } from '@ant-design/icons'
import fingerprint from "../../assets/img.png"
import { FrownOutlined, MehOutlined, SmileOutlined } from '@ant-design/icons';
import {useHistory} from "umi"
import { commonUtil } from 'qiankun-common';
import { Link } from 'umi';
import { useLocation } from "react-router-dom";
import FileSaver from 'file-saver';
import axios from 'axios';

const { TabPane } = Tabs;

const One = () => {
  const [abstract,setAbstract] = useState("abstract0")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const subject = "Automation Technology; Journalism and Media"
  const keyWords = ["artificial intelligence","AIGC","ChatGPT","knowledge production","knowledge dissemination"]
  const titles = ["Similar Article","Reader Recommendation","Associated Author"]
  const [i, setI] = useState(0)
  const Img = "https://www.edmonton.ca/sites/default/files/public-files/feature_images/community_guide_box.jpg"
  const [tags, setTags] = useState(['history', 'computer', 'art'])
  const [inputVisible, setInputVisible] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef<InputRef>(null)
  const [author, setAuthor] = useState(["author0"])
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [authorArticles, setAuthorArticles] = useState([]);
  const [modal, contextHolder] = Modal.useModal();
  const location = useLocation();
  const ReachableContext = createContext<string | null>(null);
  const UnreachableContext = createContext<string | null>(null);


  const config = {
    content: (
      <div className="hover_link">
        <ReachableContext.Consumer>{(name) => `cite: ${paperData.cite}!`}</ReachableContext.Consumer>
      </div>
    ),
  };


  const history = useHistory();
  const goBack = () => {
    history.goBack();
  }


  const Star = ({ filled }) => (
    <div style={{width:"5%",display:"flex"}}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={filled ? "orange" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-star">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
    </div>
  );

  const Rating = ({ maxStars }) => {
    const [rating, setRating] = useState(0);

    return (
      <div style={{ display: 'flex' }}>
      {[...Array(maxStars)].map((star, i) => {
          const ratingValue = i + 1;
          return (
            <label key={i}>
              <input
                type="radio"
                name="rating"
                value={ratingValue}
                onClick={() => setRating(ratingValue)}
                style={{ display: 'none' }}
              />
              <Star filled={ratingValue <= rating} key={i}/>
            </label>
          );
        })}
      </div>
    );
  };
  function more() {
    abstract === "abstract0" ? setAbstract("abstract_more") : setAbstract("abstract0")
  }

  const [paperData, setPaperData] = useState({
    title: "",
    abstracts: "",
    cite: "",
    date: "",
    tags: [],
    collaborators: [],
    comments: null
  });

  const getPaperData = async () => {
    try {
      const res = await axios.get('http://localhost:7002/api/paper/search/detail', {
        params: {
          title: location.state?location.state.param1:localStorage.getItem("jump"),
          keyword: 'tag12'
        }
      });
      console.log(location.state?location.state.param1:localStorage.getItem("jump"))
      if (res.data) {
        console.log(res.data[0]);
        setPaperData(res.data[0]);
        // Once we have the paper data, we can also fetch the related articles
        await getRelatedArticles(res.data[0].title, 'tag1');
        await getAuthorArticles(res.data[0].name,'collaborator1');
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getRelatedArticles = async (title, tag) => {
    try {
      const res = await axios.get('http://localhost:7002/api/paper/search', {
        params: {
          searchTerm: tag
        }
      });
      if (res.data) {
        let data = res.data;
        let uniqueData = data.reduce((unique, item) => {
          if (!unique.some(entry => entry.title === item.title)) {
            unique.push(item);
          }
          return unique;
        }, []);
        const filteredArticles = uniqueData.filter((article) =>
          article.title.toLowerCase().includes(title.toLowerCase())
        );
        setRelatedArticles(filteredArticles);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getAuthorArticles = async (authors,name) => {
    await axios.get('http://localhost:7002/api/paper/search', {
      params: {
        searchTerm: name
      }
    }).then((res) => {
      let data = res.data;
      let uniqueData = data.reduce((unique, item) => {
        if (!unique.some(entry => entry.title === item.title)) {
          unique.push(item);
        }
        return unique;
      }, []);
      setAuthorArticles(uniqueData);
    })
  }


  const [similarArticles, setSimilarArticles] = useState([]);

  useEffect(() => {
    const getSimilarArticles = async () => {
      try {
        const res = await axios.get('http://localhost:7002/api/paper/search', {
          params: {
            searchTerm: paperData.title
          }
        });

        if (res.data) {
          let data = res.data;
          let uniqueData = data.reduce((unique, item) => {
            if (!unique.some(entry => entry.title === item.title)) {
              unique.push(item);
            }
            return unique;
          }, []);
          const filteredArticles = uniqueData.filter((article) =>
            article.title.toLowerCase().includes(paperData.title.toLowerCase())
          );
          setSimilarArticles(filteredArticles);
        }
      } catch (error) {
        console.log(error);
      }
    }

    getSimilarArticles();
  }, [paperData.title]);

  useEffect(() => {
    getPaperData();
  }, []);

  function change(i:number) {
    setI(i)
    console.log(i)
  }

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = async () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus()
    }
  }, [inputVisible])

  const handleClose = (removedTag: string) => {
    const newTags = tags.filter((tag) => tag !== removedTag)
    setTags(newTags)
  }

  const showInput = () => {
    setInputVisible(true)
  }

  const handleClick = (param) => {
    commonUtil.qiankunJump('/api/main/two');
    localStorage.setItem('paper',param)
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleInputConfirm = async() => {
    if (inputValue && tags.indexOf(inputValue) === -1) {
      setTags([...tags, inputValue])
    }
    setInputVisible(false)
    setInputValue('')
    }

  const [value, setValue] = useState(3);  // 设置初始值为 3

  useEffect(() => {
    axios.post('http://localhost:7002/api/paper/upload/paper_data' ,
      {
        title: paperData.title,
        abstracts: paperData.abstracts,
        cite: paperData.cite,
        date: paperData.date,
        tags: tags,
        collaborators: paperData.collaborators,
      }).then((res) => {
      console.log(res)
    }).catch((err) => {
      console.log(err)
    })
  }, [tags]);

  const handleChange = (value: number) => {
    console.log(value)
    setValue(value);
  };

  const handleDownload= async () => {
    const res = await axios.get('http://localhost:7002/api/paper/download/title', {
      params: {
        author: paperData.collaborators[0],
        title: paperData.title+'.pdf',
      },
      responseType: 'blob' // Important
    });
    FileSaver.saveAs(new Blob([res.data]), 'filename.pdf');
  }

  const jump = async (state) => {
    console.log(state)
    try {
      const res = await axios.get('http://localhost:7002/api/paper/search/detail', {
        params: {
          title: state,
          keyword: 'tag12'
        }
      });
      if (res.data) {
        console.log(res.data[0]);
        setPaperData(res.data[0]);
        // Once we have the paper data, we can also fetch the related articles
        await getRelatedArticles(res.data[0].title, 'tag1');
        await getAuthorArticles(res.data[0].name, 'collaborator1');
      }
    } catch (error) {
      console.log(error);
    }
  }

  const jumpMore = async (state) => {
    localStorage.setItem('state', state);
    commonUtil.qiankunJump('/api/childOneMenu/pageFour', {param1: state});
  }

  const tagPlusStyle = {
    background: '#F998B6',
    borderStyle: 'dashed',
  }

  return(
    <div className="all">
      <div className="border">
        <Button onClick={goBack}>goBack</Button>
        <Card style={{ margin: '15px 0' }}>
          <h2 className="title">{paperData.title}</h2>
          <h4 className="title">{paperData.collaborators.join(", ")}</h4>
          <p className="abstract">Abstracts:{paperData.abstracts}</p>
          <Button onClick={more} className="font">More</Button>
          <p className="abstract">Keywords: {
            paperData.tags.map((item, i) => {
              return (<span key={i} className="keyWords">{item}, </span>)
            })
          }</p>
        </Card>
        <div className="buttons">
          <div className="button-style"> <p style={{textAlign:"center",paddingTop:".25rem",color:"white"}}><ReadOutlined />  read online</p> </div>
          <div className="button-style" onClick={handleDownload}> <p style={{textAlign:"center",paddingTop:".25rem",color:"white"}}><DownloadOutlined />  download</p> </div>
          <div className="button-style" onClick={() => {modal.info(config)}}> <p style={{textAlign:"center",paddingTop:".25rem",color:"white"}}><ShareAltOutlined />  quote</p> </div>
          {contextHolder}
          <div className="button-style"> <p style={{textAlign:"center",paddingTop:".25rem",color:"white"}} onClick={showModal}><SaveOutlined />  save</p> </div>
          <div className="button-style"> <p style={{textAlign:"center",paddingTop:".25rem",color:"white"}} onClick={()=>handleClick(paperData.title)}><SaveOutlined />  comment</p> </div>
          <Modal
            title="Article labeling"
            visible={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            okText="Collect"
            cancelText="Cancel"
          >
            <Form onFinish={handleInputConfirm}>
              <div style={{ marginBottom: 16,marginTop: 16 }}>
                <TweenOneGroup
                  enter={{
                    scale: 0.8,
                    opacity: 0,
                    type: 'from',
                    duration: 100,
                  }}
                  onEnd={(e) => {
                    if (e.type === 'appear' || e.type === 'enter') {
                      (e.target as any).style = 'display: inline-block'
                    }
                  }}
                  leave={{ opacity: 0, width: 0, scale: 0, duration: 200 }}
                  appear={false}
                >
                  {tags.map((tag) => (
                    <Tag
                      closable
                      onClose={(e) => {
                        e.preventDefault()
                        handleClose(tag)
                      }}
                    >
                      {tag}
                    </Tag>
                  ))}
                </TweenOneGroup>
              </div>
              {inputVisible && (
                <Input
                  ref={inputRef}
                  type="text"
                  size="small"
                  style={{ width: 78 }}
                  value={inputValue}
                  onChange={handleInputChange}
                  onBlur={handleInputConfirm}
                  onPressEnter={handleInputConfirm}
                />
              )}
              {!inputVisible && (
                <Tag onClick={showInput} style={tagPlusStyle}>
                  <PlusOutlined /> New Tag
                </Tag>
              )}
            </Form>
            <Form.Item
              label="Mark page"
              name="Mark page"
              rules={[{ required: true, message: 'Please enter the mark page' }]}
            >
              <InputNumber min={1} max={10} />
            </Form.Item>
          </Modal>
        </div>
        <div>
          <Tabs defaultActiveKey="1" type="card" style={{backgroundColor:"white",marginBottom:"2rem"}}>
            <TabPane tab="Similar Articles" key="1">
              <ol className="custom-list">
                {relatedArticles.map((article, key) => (
                  <li key={key} onClick={() => jump(article.title)}>{article.title}</li>
                ))}
              </ol>
            </TabPane>
            <TabPane tab="Author's Articles" key="2">
              <ol className="custom-list">
                {authorArticles.map((article, key) => (
                  <li key={key} onClick={() => jump(article.title)}>{article.title}</li>
                ))}
              </ol>
            </TabPane>
            <TabPane tab="Related Author" key="3">
              <ol className="custom-list">
                {paperData.collaborators.map((e, key) => (
                  <li key={key} onClick={() => jumpMore(e)}>{e}</li>
                ))}
              </ol>
            </TabPane>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default One
