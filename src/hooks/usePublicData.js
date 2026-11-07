import { useEffect, useState } from 'react'
import { dataService } from '../lib/dataService'
export function usePublicData(method) {
 const [state,setState]=useState({data:[],loading:true,error:false})
 useEffect(()=>{let live=true;Promise.resolve().then(()=>dataService[method]()).then(data=>{if(live)setState({data:data||[],loading:false,error:false})}).catch(()=>{if(live)setState({data:[],loading:false,error:true})});return()=>{live=false}},[method])
 return state
}
