export class MyUtil {
    static readonly NUMBER_COMPARATOR = (num1: number, num2: number) => {
        return num1 - num2;
    }
    static indexOfMax<T>(arr: T[], 
        comp: (t1: T, t2: T) => number): number {
            let index = -1;
            if(!arr || arr.length === 0) return index;
            index = 0;

            for(let i = 1; i < arr.length; i++) {
                if(comp(arr[i], arr[index]) > 0) index = i;
            }
            return index;
    }
    static max<T>(arr: T[], 
        comp: (t1: T, t2: T) => number): T {
            return arr[MyUtil.indexOfMax(arr, comp)];
    }
}