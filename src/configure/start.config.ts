import { matchesProfile } from "../environment/environment";
import { useTestStore } from "../store/test.pinia";
import { getUrlParameter } from "../utils/url.util";
import axios from "axios";

interface Filter {
    execute(): boolean | void | Promise<void>;
}

class DevProfileFilter implements Filter {
    async execute(): Promise<void> {
        if (matchesProfile('DEV')) {
            console.log('개발환경');
            try {
                await new Promise(resolve => setTimeout(resolve, 1000));
                // 실제 API 요청
                const response = await axios.get('/member.json');
                useTestStore().setTeacherMember(response.data.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } 
        }
    }
}

class SimulLoginFilter implements Filter {
    execute(): boolean {
        const isSimul: boolean = getUrlParameter('isSimul') === 'Y';
        const isLogin: boolean = window.location.pathname === '/login';
        
        if (isSimul && isLogin) {
            alert('시뮬모드');
            return true;
        }
        return false;
    }
}

class AuthModeFilter implements Filter {
    execute(): boolean {
        const isSimul: boolean = getUrlParameter('isSimul') === 'Y';
        const isLogin: boolean = window.location.pathname === '/login';
        
        if (!matchesProfile('DEV') && !isSimul && !isLogin) {
            alert('인증모드');
            return true;
        }
        return false;
    }
}

class FilterChain {
    private filters: Filter[] = [];

    addFilter(filter: Filter): void {
        this.filters.push(filter);
    }

    async execute(): Promise<void> {
        for (const filter of this.filters) {
            const result = await filter.execute();
            if (result === true) {
                break;
            }
        }
    }
}

const startConfigure = async (): Promise<void> => {
    const filterChain = new FilterChain();
    filterChain.addFilter(new DevProfileFilter());
    filterChain.addFilter(new SimulLoginFilter());
    filterChain.addFilter(new AuthModeFilter());
    await filterChain.execute();
    console.log('filterChain', filterChain);
    
};

export default startConfigure;