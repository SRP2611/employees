import React, { useEffect, useState } from 'react';
import { Pagination } from "react-pagination-bar"
import 'react-pagination-bar/dist/index.css';
import absenceList from '../src/api/json_files/absences.json';
import membersList from '../src/api/json_files/members.json';

export default function Employees() {
  let posts = absenceList.payload;
  const members = membersList.payload;
  const [postsDetail, setPosts] = useState([]);
  const [memberDetail, setMemeberDetail] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pagePostsLimit = 10;
  const [filterType, setFilterType] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [isLoading, setisLoading] = useState(false);
  let typeList = posts.map(ele => ele.type);
  let dateList = [... new Set(posts.map(ele => ele.startDate))]
  typeList = [... new Set(typeList)]

  const getTimeDiffence = (date1, date2) => {
    date1 = new Date(date1);
    date2 = new Date(date2);
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + " days"
  }

  const getEmployeeDetail = () => {
    setisLoading(true);
    fetch("http://localhost:8000/employee_detail")
      .then(res => res.json())
      .then(
        (result) => {
          setMemeberDetail(result.memeberData.payload);
          setPosts(result.absenceData.payload);
          setTimeout(()=>{
            setisLoading(false);
          }, 500)

        },
        (error) => {
          alert('Some error occured');
          console.log(error);
        }
      )
  }


  useEffect(() => {
    return () => {
      getEmployeeDetail();
    }
  }, [])


  const getItemDetail = () => {
    const itemLists = postsDetail?.filter((val) => (
      (filterType != "" ? val.type === filterType : val.type) &&
      (filterDate != "" ? val.startDate === filterDate : val.startDate)
    ));

     
    return <> {itemLists.length == 0 ? <h1 style={{color:'white'}}>No Item </h1>  : itemLists.slice((currentPage - 1) * pagePostsLimit, currentPage * pagePostsLimit)
      .map((post) => (<div key={post.id} className="employee_list">

        <div style={{display :'flex'}}>
          <div style={{minWidth:'100px'}}>

              <hr />
              {memberDetail?.filter(ele => ele.userId === post.userId).map((mem) => <span style={{ color: 'red' }}>{mem.name}</span>)}
              <hr />

            {memberDetail?.filter(ele => ele.userId === post.userId).map((mem) => <img src={mem.image} style={{ height:'150px', width:'100%' }}/>)}

          </div>

          <div style={{padding:'20px',margin:'10px'}}>
            UserId : {post.userId}<br />
            Type : {post?.type}<br />
            Time : {getTimeDiffence(post.startDate, post.endDate)}<br />
            Member Note : {post.memberNote || "-"}<br />
            Status : {post.rejectedAt != null ? 'Rejected' : (post.confirmedAt != null ? 'Confirmed ' : 'Requested')}<br />
            Admitter Note : {post.admitterNote}
          </div>
        </div>

      </div>
      ))}
    </>
  }

  return (
    <div className="" data-testid="counter">

      <hr />
      Employees Details <br />
      Total Employee :  {posts.length}<br />
      <hr />

      <div style={{ textAlign: 'initial', marginLeft: '10%' }}>
        Select Type :
        <select data-testid="select" onChange={(ele) => setFilterType(ele.target.value)}>
          <option data-testid="select-option" value="">--None-- </option>
          {typeList.map((ele, index) => <option data-testid="select-option" key={ele}
            value={ele}>
            {ele}
          </option>)}
        </select>
        <br />

        Select Start Date :
        <select onChange={(ele) => setFilterDate(ele.target.value)}>
          <option value="">--None-- </option>
          {dateList.map((ele) => <option key={ele}
            value={ele}>
            {ele}
          </option>)}
        </select>

      </div>

      <div style={{ height: '500px', overFlow: 'scroll' }} className="itemDetail_list">
        {isLoading ? <h1 style={{color:'white'}}>Loading ...</h1> : getItemDetail()}
      </div>

      <Pagination
        currentPage={currentPage}
        itemsPerPage={pagePostsLimit}
        onPageChange={(pageNumber) => setCurrentPage(pageNumber)}
        totalItems={posts.length}
        pageNeighbours={2}
      />
    </div>
  );
}
