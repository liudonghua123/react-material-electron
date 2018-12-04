import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import './about.css';

class About extends Component {
  render() {
    return (
      <Card className="card">
        <CardContent className="cardContent">
          <div>
            <h2>关于</h2>
            <p>
              这个简单的app可以实现同义词替换，使用的是
              https://github.com/liudonghua123/node-segment 这个库，详细的同义词可以参考
              https://github.com/liudonghua123/node-segment/blob/master/dicts/synonym.txt
            </p>
            <p>
              同义词替换之后可以使用复制结果到待处理区，然后通过自定义配置的查找替换规则进行再次替换
            </p>
            <p>
              在配置中，可以添加，删除，修改（双击进行编辑，ESC退出），导入（使用txt文件，每一行一个查找词,替换词，注意是英文逗号，并且文件编码是UTF8），导出
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
}

export default About;
